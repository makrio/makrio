require 'spec_helper'

describe ConversationsController do
  describe 'show' do
    it 'is successful' do
      get :show, :id => 1
      response.should be_success
    end
  end
end