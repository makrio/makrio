#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe PublicsController do
  let(:fixture_path) { File.join(Rails.root, 'spec', 'fixtures')}
  before do
    @user = alice
    @person = Factory(:person)
  end

  describe '#host_meta' do
    it 'succeeds', :fixture => true do
      get :host_meta
      response.should be_success
      response.body.should =~ /webfinger/
      save_fixture(response.body, "host-meta", fixture_path)
    end
  end

  describe '#hcard' do
    it "succeeds", :fixture => true do
      post :hcard, "guid" => @user.person.guid.to_s
      response.should be_success
      save_fixture(response.body, "hcard", fixture_path)
    end

    it 'sets the person' do
      post :hcard, "guid" => @user.person.guid.to_s
      assigns[:person].should == @user.person
    end

    it 'does not query by user id' do
      post :hcard, "guid" => 90348257609247856.to_s
      assigns[:person].should be_nil
      response.should be_not_found
    end

    it 'finds nothing for closed accounts' do
      @user.person.update_attributes(:closed_account => true)
      get :hcard, :guid => @user.person.guid.to_s
      response.should be_not_found
    end
  end

  describe '#webfinger' do
    it "succeeds when the person and user exist locally", :fixture => true do
      post :webfinger, 'q' => @user.person.diaspora_handle
      response.should be_success
      save_fixture(response.body, "webfinger", fixture_path)
    end

    it "404s when the person exists remotely because it is local only" do
      stub_success('me@mydiaspora.pod.com')
      post :webfinger, 'q' => 'me@mydiaspora.pod.com'
      response.should be_not_found
    end

    it "404s when the person is local but doesn't have an owner" do
      post :webfinger, 'q' => @person.diaspora_handle
      response.should be_not_found
    end

    it "404s when the person does not exist locally or remotely" do
      stub_failure('me@mydiaspora.pod.com')
      post :webfinger, 'q' => 'me@mydiaspora.pod.com'
      response.should be_not_found
    end

    it 'has the users profile href' do
      get :webfinger, :q => @user.diaspora_handle
      response.body.should include "http://webfinger.net/rel/profile-page"
    end

    it 'finds nothing for closed accounts' do
      @user.person.update_attributes(:closed_account => true)
      get :webfinger, :q => @user.diaspora_handle
      response.should be_not_found
    end
  end

  describe '#hub' do
    it 'succeeds' do
      get :hub
      response.should be_success
    end
  end
end
