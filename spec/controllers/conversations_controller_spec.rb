require 'spec_helper'

describe ConversationsController do
  describe 'show' do
    it 'is successful' do
      post = alice.post :status_message, :text => "AWESOME", :to => alice.aspects.first

      get :show, :id => post.id
      response.should be_success
    end
  end
end