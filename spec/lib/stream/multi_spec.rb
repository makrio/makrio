require 'spec_helper'
require File.join(Rails.root, 'spec', 'shared_behaviors', 'stream')

describe Stream::Multi do
  before do
    @stream = Stream::Multi.new(alice, :max_time => Time.now, :order => 'updated_at')
  end

  describe 'shared behaviors' do
    it_should_behave_like 'it is a stream'
  end

  describe '#publisher_opts' do
    it 'prefills, sets public, and autoexpands if welcome? is set' do
      prefill_text = "sup?"
      @stream.stub(:welcome?).and_return(true)
      @stream.stub(:publisher_prefill).and_return(prefill_text)
      @stream.send(:publisher_opts).should == {:open => true,
                                               :prefill => prefill_text,
                                               :public => true}
    end

    it 'provides no opts if welcome? is not set' do
      prefill_text = "sup?"
      @stream.stub(:welcome?).and_return(false)
      @stream.send(:publisher_opts).should == {}
    end
  end

  describe "#publisher_prefill" do
    before do
      @tag = ActsAsTaggableOn::Tag.find_or_create_by_name("cats")
      @tag_following = alice.tag_followings.create(:tag_id => @tag.id)

      @stream = Stream::Multi.new(alice)
    end

    it 'returns includes new user hashtag' do
      @stream.send(:publisher_prefill).should match(/#NewHere/i)
    end

    it 'includes followed hashtags' do
      @stream.send(:publisher_prefill).should include("#cats")
    end

    context 'when invited by another user' do
      before do
        @user = Factory(:user, :invited_by => alice)
        @inviter = alice.person

        @stream = Stream::Multi.new(@user)
      end

      it 'includes a mention of the inviter' do
        mention = "@{#{@inviter.name} ; #{@inviter.diaspora_handle}}"
        @stream.send(:publisher_prefill).should include(mention)
      end
    end
  end
end
