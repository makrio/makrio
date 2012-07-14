require 'spec_helper'

describe PostInteractionPresenter do
  before do
    @sm = Factory(:status_message, :public => true)
    @presenter = PostInteractionPresenter.new(@sm, bob)
    @unauthenticated_presenter = PostInteractionPresenter.new(@sm)
  end

  it 'takes a post and an optional user' do
    @presenter.should_not be_nil
  end

  describe '#as_json' do
    it 'works with a user' do
      @presenter.as_json.should be_a Hash
    end

    it 'works without a user' do
      @unauthenticated_presenter.as_json.should be_a Hash
    end
  end

  describe PostInteractionPresenter::Lite do
    before do
      @presenter = PostInteractionPresenter::Lite.new(@sm, bob)
      @unauthenticated_presenter = PostInteractionPresenter::Lite.new(@sm)
    end

    describe '#user_like' do
      it 'includes the users like' do
        bob.like!(@sm)
        @presenter.user_like.should be_present
      end

      it 'is nil if the user is not authenticated' do
        @unauthenticated_presenter.user_like.should be_nil
      end
    end

    describe '#user_reshare' do
      it 'includes the users reshare' do
        bob.reshare!(@sm)
        @presenter.user_reshare.should be_present
      end

      it 'is nil if the user is not authenticated' do
        @unauthenticated_presenter.user_reshare.should be_nil
      end
    end
  end
end
