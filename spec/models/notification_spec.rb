#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe Notification do
  before do
    @sm = Factory(:status_message)
    @person = Factory(:person)
    @user = alice
    @user2 = eve
    @aspect  = @user.aspects.create(:name => "dudes")
    @opts = {:target_id => @sm.id,
      :target_type => @sm.class.base_class.to_s,
      :type => 'Notifications::CommentOnPost',
      :actors => [@person],
      :recipient_id => @user.id}
    @note = Notification.new(@opts)
  end

  it 'destoys the associated notification_actor' do
    @note.save
    lambda{@note.destroy}.should change(NotificationActor, :count).by(-1)
  end

  describe '.for' do
    it 'returns all of a users notifications' do
      user2 = Factory(:user)
      4.times do
        Notification.create(@opts)
      end

      @opts.delete(:recipient_id)
      Notification.create(@opts.merge(:recipient_id => user2.id))

      Notification.for(@user).count.should == 4
    end
  end

  describe 'set_read_state method' do
    it "should set an unread notification to read" do
      @note.unread = true
      @note.set_read_state( true )
      @note.unread.should == false
    end
    it "should set an read notification to unread" do
      @note.unread = false
      @note.set_read_state( false )
      @note.unread.should == true
    end
  end

  describe '.concatenate_or_create' do
    it 'creates a new notificiation if the notification does not exist, or if it is unread' do
      @note.unread = false
      @note.save
      Notification.count.should == 1
      Notification.concatenate_or_create(@note.recipient, @note.target, @note.actors.first, Notifications::CommentOnPost)
      Notification.count.should == 2
    end
  end
end

