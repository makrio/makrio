require 'spec_helper'

describe Notifier do
  include ActionView::Helpers::TextHelper

  let(:person) { Factory(:person) }

  before do
    Notifier.deliveries = []
    AppConfig[:pod_name] = "makr.io"
  end

  describe '.administrative' do
    it 'mails a user' do
      mails = Notifier.admin("Welcome to bureaucracy!", [bob])
      mails.length.should == 1
      mail = mails.first
      mail.to.should == [bob.email]
      mail.body.encoded.should match /Welcome to bureaucracy!/
      mail.body.encoded.should match /#{bob.username}/
    end

    context 'mails a bunch of users' do
      before do
        @users = []
        5.times do
          @users << Factory(:user)
        end
      end
      it 'has a body' do
        mails = Notifier.admin("Welcome to bureaucracy!", @users)
        mails.length.should == 5
        mails.each{|mail|
          this_user = @users.detect{|u| mail.to == [u.email]}
          mail.body.encoded.should match /Welcome to bureaucracy!/
          mail.body.encoded.should match /#{this_user.username}/
        }
      end

      it "has attachments" do
        mails = Notifier.admin("Welcome to bureaucracy!", @users, :attachments => [{:name => "retention stats", :file => "here is some file content"}])
        mails.length.should == 5
        mails.each{|mail|
          mail.attachments.count.should == 1
        }
      end
    end
  end

  describe '.single_admin' do
    it 'mails a user' do
      mail = Notifier.single_admin("Welcome to bureaucracy!", bob)
      mail.to.should == [bob.email]
      mail.body.encoded.should match /Welcome to bureaucracy!/
      mail.body.encoded.should match /#{bob.username}/
    end

    it 'has the layout' do
      mail = Notifier.single_admin("Welcome to bureaucracy!", bob)
      mail.body.encoded.should match /change your notification settings/
    end

    it 'has an optional attachment' do
      mail = Notifier.single_admin("Welcome to bureaucracy!", bob, :attachments => [{:name => "retention stats", :file => "here is some file content"}])
      mail.attachments.length.should == 1
    end
  end

  describe ".started_sharing" do
    let!(:request_mail) { Notifier.started_sharing(bob.id, person.id) }

    it 'goes to the right person' do
      request_mail.to.should == [bob.email]
    end

    it 'has the name of person sending the request' do
      request_mail.body.encoded.include?(person.name).should be true
    end

    it 'has the css' do
      request_mail.body.encoded.include?("<style type='text/css'>")
    end
  end

  describe ".mentioned" do
    before do
      @user = alice
      @sm = Factory(:status_message)
      @m = Mention.create(:person => @user.person, :post=> @sm)

      @mail = Notifier.mentioned(@user.id, @sm.author.id, @m.id)
    end

    it 'TO: goes to the right person' do
      @mail.to.should == [@user.email]
    end

    it 'SUBJECT: has the name of person mentioning in the subject' do
      @mail.subject.should include(@sm.author.name)
    end

    it 'has the post text in the body' do
      @mail.body.encoded.should include(@sm.text)
    end

    it 'should not include translation fallback' do
      @mail.body.encoded.should_not include(I18n.translate 'notifier.a_post_you_shared')
    end
  end

  describe ".liked" do
    before do
      @sm = Factory(:status_message, :author => alice.person)
      @like = @sm.likes.create!(:author => bob.person)
      @mail = Notifier.liked(alice.id, @like.author.id, @like.id)
    end

    it 'TO: goes to the right person' do
      @mail.to.should == [alice.email]
    end

    it 'BODY: contains the truncated original post' do
      @mail.body.encoded.should include(@sm.formatted_message)
    end

    it 'BODY: contains the name of person liking' do
      @mail.body.encoded.should include(@like.author.name)
    end

    it 'should not include translation fallback' do
      @mail.body.encoded.should_not include(I18n.translate 'notifier.a_post_you_shared')
    end

  end

  context "comments" do
    let(:commented_post) {bob.post(:status_message, :text => "It's really sunny outside today, and this is a super long status message!  #notreally", :to => :all)}
    let(:comment) { eve.comment!(commented_post, "Totally is")}

    describe ".comment_on_post" do
      let(:comment_mail) {Notifier.comment_on_post(bob.id, person.id, comment.id).deliver}

      it 'TO: goes to the right person' do
        comment_mail.to.should == [bob.email]
      end

      it "FROM: contains the sender's name" do
        comment_mail["From"].to_s.should == "\"#{eve.name} (#{AppConfig[:pod_name]})\" <#{AppConfig[:smtp_sender_address]}>"
      end

      it 'SUBJECT: has a snippet of the post contents' do
        comment_mail.subject.should == "Re: #{truncate(commented_post.text, :length => 70)}"
      end

      context 'BODY' do
        it "contains the comment" do
          comment_mail.body.encoded.should include(comment.text)
        end

        it "contains the original post's link" do
          comment_mail.body.encoded.include?("#{comment.post.id.to_s}").should be true
        end

        it 'should not include translation fallback' do
          comment_mail.body.encoded.should_not include(I18n.translate 'notifier.a_post_you_shared')
        end
      end
    end

    describe ".also_commented" do
      let(:comment_mail) { Notifier.also_commented(bob.id, person.id, comment.id) }

      it 'TO: goes to the right person' do
        comment_mail.to.should == [bob.email]
      end

      it 'FROM: has the name of person commenting as the sender' do
        comment_mail["From"].to_s.should == "\"#{eve.name} (#{AppConfig[:pod_name]})\" <#{AppConfig[:smtp_sender_address]}>"
      end

      it 'SUBJECT: has a snippet of the post contents' do
        comment_mail.subject.should == "Re: #{truncate(commented_post.text, :length => 70)}"
      end

      context 'BODY' do
        it "contains the comment" do
          comment_mail.body.encoded.should include(comment.text)
        end

        it "contains the original post's link" do
          comment_mail.body.encoded.include?("#{comment.post.id.to_s}").should be true
        end

        it 'should not include translation fallback' do
          comment_mail.body.encoded.should_not include(I18n.translate 'notifier.a_post_you_shared')
        end
      end
    end

    describe ".confirm_email" do
      before do
        bob.update_attribute(:unconfirmed_email, "my@newemail.com")
        @confirm_email = Notifier.confirm_email(bob.id)
      end

      it 'goes to the right person' do
        @confirm_email.to.should == [bob.unconfirmed_email]
      end

      it 'has the unconfirmed emil in the subject' do
        @confirm_email.subject.should include(bob.unconfirmed_email)
      end

      it 'has the unconfirmed emil in the body' do
        @confirm_email.body.encoded.should include(bob.unconfirmed_email)
      end

      it 'has the receivers name in the body' do
        @confirm_email.body.encoded.should include(bob.person.profile.first_name)
      end

      it 'has the activation link in the body' do
        @confirm_email.body.encoded.should include(confirm_email_url(:token => bob.confirm_email_token))
      end
    end
  end

  describe 'hashtags' do
    it 'escapes hashtags' do
      mails = Notifier.admin("#Welcome to bureaucracy!", [bob])
      mails.length.should == 1
      mail = mails.first
      mail.body.encoded.should match "<p><a href=\"http://localhost:9887/tags/welcome\">#Welcome</a> to bureaucracy!</p>"
    end
  end
end
