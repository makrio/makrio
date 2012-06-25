require 'spec_helper'

describe Reshare do
  include ActionView::Helpers::UrlHelper
  include Rails.application.routes.url_helpers
  def controller
    mock()
  end


  it 'has a valid Factory' do
    Factory(:reshare).should be_valid
  end

  it 'requires parent' do
    reshare = Factory.build(:reshare, :parent => nil)
    reshare.should_not be_valid
  end

  it 'require public parent' do
    reshare = Factory.build(:reshare, :parent => Factory.build(:status_message, :public => false))
    reshare.should_not be_valid
    reshare.errors[:base].should include('Only posts which are public may be reshared.')
  end

  it 'forces public' do
    Factory(:reshare, :public => false).public.should be_true
  end

  describe "#receive" do
    let(:receive) {@reshare.receive(@parent.author.owner, @reshare.author)}
    before do
      @reshare = Factory(:reshare, :parent => Factory(:status_message, :author => bob.person, :public => true))
      @parent = @reshare.parent
    end

    it 'increments the reshare count' do
      receive
      @parent.resharers.count.should == 1
    end

    it 'adds the resharer to the re-sharers of the post' do
      receive
      @parent.resharers.should include(@reshare.author)
    end
    it 'does not error if the parent author has a contact for the resharer' do
      bob.share_with @reshare.author, bob.aspects.first
      proc {
        Timeout.timeout(5) do
          receive #This doesn't ever terminate on my machine before it was fixed.
        end
      }.should_not raise_error
    end
  end

  describe '#nsfw' do
    before do
      sfw  = Factory(:status_message, :author => alice.person, :public => true)
      nsfw = Factory(:status_message, :author => alice.person, :public => true, :text => "This is #nsfw")
      @sfw_reshare = Factory(:reshare, :parent => sfw)
      @nsfw_reshare = Factory(:reshare, :parent => nsfw)
    end

    it 'deletates #nsfw to the parent post' do
      @sfw_reshare.nsfw.should_not be_true
      @nsfw_reshare.nsfw.should be_true
    end
  end

  describe '#notification_type' do
    before do
      sm = Factory(:status_message, :author => alice.person, :public => true)
      @reshare = Factory(:reshare, :parent => sm)
    end
    it 'does not return anything for non-author of the original post' do
      @reshare.notification_type(bob, @reshare.author).should be_nil
    end

    it 'returns "Reshared" for the original post author' do
      @reshare.notification_type(alice, @reshare.author).should == Notifications::Reshared
    end
  end

  describe '#absolute_parent' do
    it 'resolves parent posts to the top level' do
      pending
      @sm = Factory(:status_message, :author => alice.person, :public => true)
      rs1 = Factory(:reshare, :parent=>@sm)
      rs2 = Factory(:reshare, :parent=>rs1)
      @rs3 = Factory(:reshare, :parent=>rs2)
      @rs3.absolute_parent.should == @sm
    end
  end

  describe "XML" do
    before do
      @reshare = Factory(:reshare)
      @xml = @reshare.to_xml.to_s
    end

    context 'serialization' do
      it 'serializes parent_diaspora_id' do
        @xml.should include("parent_diaspora_id")
        @xml.should include(@reshare.author.diaspora_handle)
      end

      it 'serializes parent_guid' do
        @xml.should include("parent_guid")
        @xml.should include(@reshare.parent.guid)
      end
    end

    context 'marshalling' do
      context 'local' do
        before do
          @original_author = @reshare.parent.author
          @parent_object = @reshare.parent
        end

        it 'marshals the guid' do
          Reshare.from_xml(@xml).parent_guid.should == @parent_object.guid
        end

        it 'fetches the parent post from parent_guid' do
          Reshare.from_xml(@xml).parent.should == @parent_object
        end

        it 'fetches the parent author from parent_diaspora_id' do
          Reshare.from_xml(@xml).parent.author.should == @original_author
        end
      end

      describe 'destroy' do
        it 'allows you to destroy the reshare if the parent post is missing' do
          reshare = Factory(:reshare)
          reshare.parent = nil
          
          expect{
            reshare.destroy
          }.should_not raise_error
        end
      end

      context 'remote' do
        before do
          @parent_object = @reshare.parent
          @parent_object.delete
          @response = mock
          @response.stub(:status).and_return(200)
          @response.stub(:success?).and_return(true)
        end

        it 'fetches the parent author from parent_diaspora_id' do
          @original_profile = @reshare.parent.author.profile.dup
          @reshare.parent.author.profile.delete
          @original_author = @reshare.parent.author.dup
          @reshare.parent.author.delete

          @original_author.profile = @original_profile

          wf_prof_mock = mock
          wf_prof_mock.should_receive(:fetch).and_return(@original_author)
          Webfinger.should_receive(:new).and_return(wf_prof_mock)
          
          @response.stub(:body).and_return(@parent_object.to_diaspora_xml)

          Faraday.default_connection.should_receive(:get).with(@original_author.url + short_post_path(@parent_object.guid, :format => "xml")).and_return(@response)
          Reshare.from_xml(@xml)
        end

        context "fetching post" do
          it "doesn't error out if the post is not found" do
            @response.stub(:status).and_return(404)
            Faraday.default_connection.should_receive(:get).and_return(@response)
            
            expect {
              Reshare.from_xml(@xml)
            }.to_not raise_error
          end
          
          it "raises if there's another error receiving the post" do
            @response.stub(:status).and_return(500)
            @response.stub(:success?).and_return(false)
            Faraday.default_connection.should_receive(:get).and_return(@response)
            
            expect {
              Reshare.from_xml(@xml)
            }.to raise_error RuntimeError
          end
        end

        context 'saving the post' do
          before do
            @response.stub(:body).and_return(@parent_object.to_diaspora_xml)
            Faraday.default_connection.stub(:get).with(@reshare.parent.author.url + short_post_path(@parent_object.guid, :format => "xml")).and_return(@response)
          end

          it 'fetches the parent post from parent_guid' do
            parent = Reshare.from_xml(@xml).parent

            [:text, :guid, :diaspora_handle, :type, :public].each do |attr|
              parent.send(attr).should == @reshare.parent.send(attr)
            end
          end

          it 'correctly saves the type' do
            Reshare.from_xml(@xml).parent.reload.type.should == "StatusMessage"
          end

          it 'correctly sets the author' do
            @original_author = @reshare.parent.author
            Reshare.from_xml(@xml).parent.reload.author.reload.should == @original_author
          end

          it 'verifies that the author of the post received is the same as the author in the reshare xml' do
            @original_author = @reshare.parent.author.dup
            @xml = @reshare.to_xml.to_s

            different_person = Factory(:person)

            wf_prof_mock = mock
            wf_prof_mock.should_receive(:fetch).and_return(different_person)
            Webfinger.should_receive(:new).and_return(wf_prof_mock)

            different_person.stub(:url).and_return(@original_author.url)

            lambda{
              Reshare.from_xml(@xml)
            }.should raise_error /^Diaspora ID \(.+\) in the parent does not match the Diaspora ID \(.+\) specified in the reshare!$/
          end
        end
      end
    end
  end
end
