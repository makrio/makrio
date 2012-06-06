#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe HomeController do
  describe '#show' do
    it 'does not redirect if logged out' do
      sign_out :user
      get :show
      response.should_not be_redirect
    end

    it 'redirects to the stream if logged in' do
      sign_in alice
      get :show, :home => true
      response.should redirect_to(stream_path)
    end
  end
end
