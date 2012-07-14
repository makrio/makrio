#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

def hashtag!(sm , tag)
  sm.tag_list << tag
  sm.save
end

require 'spec_helper'

describe StatusMessage do
  include ActionView::Helpers::UrlHelper
  include PeopleHelper
  include Rails.application.routes.url_helpers
  def controller
    mock()
  end

  before do
    @user = alice
    @aspect = @user.aspects.first
  end

  describe 'scopes' do
    context "tag_streams" do
      before do

        @sm1 = Factory(:status_message, :public => true)
        @sm2 = Factory(:status_message)
        @sm3 = Factory(:status_message, :public => true )
        @sm4 = Factory(:status_message)
        [@sm1, @sm2, @sm4].each{|x| hashtag!(x, 'hashtag')}
        hashtag!(@sm3, 'awesome')
        @tag_id = ActsAsTaggableOn::Tag.where(:name => "hashtag").first.id
      end

      describe '.tag_steam' do
        it 'returns status messages tagged with the tag' do
          tag_stream = StatusMessage.send(:tag_stream, [@tag_id])
          tag_stream.should include @sm1
          tag_stream.should include @sm2
        end
      end

      describe '.public_tag_stream' do
        it 'returns public status messages tagged with the tag' do
          StatusMessage.public_tag_stream([@tag_id]).should == [@sm1]
        end
      end

      describe '.user_tag_stream' do
        it 'returns tag stream thats owned or visibile by' do
          StatusMessage.should_receive(:owned_or_visible_by_user).with(bob).and_return(StatusMessage)
          StatusMessage.should_receive(:tag_stream).with([@tag_id])

          StatusMessage.user_tag_stream(bob, [@tag_id])
        end
      end
    end
  end

  describe ".guids_for_author" do
    it 'returns an array of the status_message guids' do
      sm1 = Factory(:status_message, :author => alice.person)
      sm2 = Factory(:status_message, :author => bob.person)
      guids = StatusMessage.guids_for_author(alice.person)
      guids.should == [sm1.guid]
    end
  end

  describe '#diaspora_handle=' do
    it 'sets #author' do
      person = Factory(:person)
      post = Factory(:status_message, :author => @user.person)
      post.diaspora_handle = person.diaspora_handle
      post.author.should == person
    end
  end
  it "should have either a message or at least one photo" do
    n = Factory.build(:status_message, :text => nil)
#    n.valid?.should be_false

#    n.text = ""
#    n.valid?.should be_false

    n.text = "wales"
    n.valid?.should be_true
    n.text = nil

    photo = @user.build_post(:photo, :user_file => uploaded_photo, :to => @aspect.id)
    photo.save!

    n.photos << photo
    n.valid?.should be_true
    n.errors.full_messages.should == []
  end

  it 'should be postable through the user' do
    message = "Users do things"
    status = @user.post(:status_message, :text => message, :to => @aspect.id)
    db_status = StatusMessage.find(status.id)
    db_status.text.should == message
  end

  it 'should require status messages not be more than 65535 characters long' do
    message = 'a' * (65535+1)
    status_message = Factory.build(:status_message, :text => message)
    status_message.should_not be_valid
  end

  describe "#nsfw" do
    it 'returns MatchObject (true) if the post contains #nsfw (however capitalised)' do
       status  = Factory(:status_message, :text => "This message is #nSFw")
       status.nsfw.should be_true
    end

    it 'returns nil (false) if the post does not contain #nsfw' do
       status  = Factory(:status_message, :text => "This message is #sFW")
       status.nsfw.should be_false
    end
  end

  describe 'tags' do
    before do
      @object = Factory.build(:status_message)
    end

    it 'associates different-case tags to the same tag entry' do
      assert_equal ActsAsTaggableOn.force_lowercase, true

      msg_lc = Factory.build(:status_message, :text => '#newhere')
      msg_uc = Factory.build(:status_message, :text => '#NewHere')
      msg_cp = Factory.build(:status_message, :text => '#NEWHERE')

      msg_lc.save; msg_uc.save; msg_cp.save

      tag_array = msg_lc.tags
      msg_uc.tags.should =~ tag_array
      msg_cp.tags.should =~ tag_array
    end
  end

  describe "XML" do
    before do
      @message = Factory(:status_message, :text => "I hate WALRUSES!", :author => @user.person)
      @xml = @message.to_xml.to_s
    end
    it 'serializes the unescaped, unprocessed message' do
      @message.text = "<script> alert('xss should be federated');</script>"
      @message.to_xml.to_s.should include @message.text
    end
    it 'serializes the message' do
      @xml.should include "<raw_message>I hate WALRUSES!</raw_message>"
    end

    it 'serializes the author address' do
      @xml.should include(@user.person.diaspora_handle)
    end

    describe '.from_xml' do
      before do
        @marshalled = StatusMessage.from_xml(@xml)
      end
      it 'marshals the message' do
        @marshalled.text.should == "I hate WALRUSES!"
      end
      it 'marshals the guid' do
        @marshalled.guid.should == @message.guid
      end
      it 'marshals the author' do
        @marshalled.author.should == @message.author
      end
      it 'marshals the diaspora_handle' do
        @marshalled.diaspora_handle.should == @message.diaspora_handle
      end
    end
  end

  describe '#after_dispatch' do
    before do
      @photos = [alice.build_post(:photo, :user_file=> File.open(photo_fixture_name)),
                 alice.build_post(:photo, :user_file=> File.open(photo_fixture_name))]

      @photos.each(&:save!)

      @status_message = alice.build_post(:status_message, :text => "the best pebble.")
        @status_message.photos << @photos

      @status_message.save!
      alice.add_to_streams(@status_message, alice.aspects)
    end
  end

  describe 'oembed' do
    before do
      @youtube_url = "https://www.youtube.com/watch?v=3PtFwlKfvHI"
      @message_text = "#{@youtube_url} is so cool. so is this link -> https://joindiaspora.com"
    end

    it 'should queue a GatherOembedData if it includes a link' do
      sm = Factory.build(:status_message, :text => @message_text)
      Resque.should_receive(:enqueue).with(Jobs::GatherOEmbedData, instance_of(Fixnum), instance_of(String))
      sm.save
    end

    describe '#contains_oembed_url_in_text?' do
      it 'returns the oembed urls found in the raw message' do
        sm = Factory(:status_message, :text => @message_text)
        sm.contains_oembed_url_in_text?.should_not be_nil
        sm.oembed_url.should == @youtube_url
      end
    end
  end
end
