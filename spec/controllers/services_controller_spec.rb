#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe ServicesController do
  let(:mock_access_token) { Object.new }

  before do
    @user   = alice
    @aspect = @user.aspects.first

    sign_in :user, @user
    @controller.stub!(:current_user).and_return(@user)
    mock_access_token.stub!(:token => "12345", :secret => "56789")
  end

  describe '#index' do
    it 'displays all connected serivices for a user' do
      4.times do
        Factory(:service, :user => @user)
      end

      get :index
      assigns[:services].should == @user.services
    end
  end


  describe '#destroy' do
    before do
      @service1 = Factory(:service, :user => @user)
    end

    it 'destroys a service selected by id' do
      lambda{
        delete :destroy, :id => @service1.id
      }.should change(@user.services, :count).by(-1)
    end
  end
end
