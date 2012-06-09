#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe 'making sure the spec runner works' do
  it 'factory creates a user with a person saved' do
    user = Factory(:user)
    loaded_user = User.find(user.id)
    loaded_user.person.owner_id.should == user.id
  end

  describe 'fixtures' do
    it 'loads fixtures' do
      User.count.should_not == 0
    end
  end

  describe '#post' do
    it 'creates a notification with a mention' do
      lambda{
        alice.post(:status_message, :text => "@{Bob Grimn; #{bob.person.diaspora_handle}} you are silly", :to => alice.aspects.find_by_name('generic'))
      }.should change(Notification, :count).by(1)
    end
  end
end
