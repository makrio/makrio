#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe StreamsController do
  before do
    sign_in alice
  end

  describe '#multi' do
    before do
      @old_spotlight_value = AppConfig[:community_spotlight]
    end

    after do
      AppConfig[:community_spotlight] = @old_spotlight_value
    end

    it 'succeeds' do
      AppConfig[:community_spotlight] = [bob.person.diaspora_handle]
      get :show
      response.should be_success
    end

    it 'succeeds without AppConfig[:community_spotlight]' do
      AppConfig[:community_spotlight] = nil
      get :show
      response.should be_success
    end

    it 'succeeds on mobile' do
      get :show, :format => :mobile
      response.should be_success
    end
  end
end
