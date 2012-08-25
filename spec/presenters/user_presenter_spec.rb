require 'spec_helper'

describe UserPresenter do
  before do
    @presenter = UserPresenter.new(bob)
  end

  describe '#to_json' do
    it 'works' do
      @presenter.as_json.should be_present
    end
  end

  describe '#services' do
    it 'provides an array of jsonifed services' do
      fakebook = stub(:provider => 'fakebook', :access_token => 'foo')
      bob.stub(:services).and_return([fakebook])
      @presenter.services.should include(:provider => 'fakebook', :access_token => 'foo')
    end
  end

  describe '#configured_services' do
    it 'displays a list of the users configured services' do

      fakebook = stub(:provider => 'fakebook', :access_token => 'foo')
      bob.stub(:services).and_return([fakebook])
      @presenter.configured_services.should include("fakebook")
    end
  end
end