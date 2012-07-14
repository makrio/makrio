#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe Mention do
  describe '#notification_type' do
    it "returns 'mentioned'" do
     Mention.new.notification_type.should == Notifications::Mentioned
    end
  end

  describe 'after destroy' do
    it 'destroys a notification' do
      @user = alice
      @mentioned_user = bob

      @sm =  @user.post(:status_message, :text => "hi", :to => @user.aspects.first)
      @m  = Mention.create!(:person => @mentioned_user.person, :post => @sm)
      @m.notify_recipient

      lambda{
        @m.destroy
      }.should change(Notification, :count).by(-1)
    end
  end
end

