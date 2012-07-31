#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe NotificationsController do
  before do
    sign_in :user, alice
    @note = Factory(:notification, :recipient => alice)
  end

  describe '#update' do
    it 'marks a notification as read if it gets no other information' do
      get :update, "id" => @note.id
      @note.reload.unread.should be_false
    end

    it 'marks a notification as read if it is told to' do
      get :update, "id" => @note.id, :set_unread => "false"
      @note.reload.unread.should be_false
    end

    it 'marks a notification as unread if it is told to' do
      get :update, "id" => @note.id, :set_unread => "true"
      @note.reload.unread.should be_true

    end

    it 'only lets you read your own notifications' do
      note = Factory(:notification, :recipient => bob)
      get :update, "id" => note.id, :set_unread => "false"
      note.reload.unread.should == true
    end
  end

  describe "#read_all" do
    it 'marks all notifications as read' do
      request.env["HTTP_REFERER"] = "I wish I were spelled right"
      Factory(:notification, :recipient => alice)
      Factory(:notification, :recipient => alice)

      Notification.where(:unread => true).count.should == 3
      get :read_all
      Notification.where(:unread => true).count.should == 0
    end
    it "should redirect to the stream in the html version" do
      Factory(:notification, :recipient => alice)
      get :read_all, :format => :html
      response.should redirect_to(latest_path)
    end
    it "should redirect to the stream in the mobile version" do
      Factory(:notification, :recipient => alice)
      get :read_all, :format => :mobile
      response.should redirect_to(latest_path)
    end
    it "should return a dummy value in the json version" do
      Factory(:notification, :recipient => alice)
      get :read_all, :format => :json
      response.should_not be_redirect
    end
  end

  describe '#index' do
    before do
      @post = Factory(:status_message)
      Factory(:notification, :recipient => alice, :target => @post)
    end

    it 'succeeds for notification dropdown' do
      get :index, :format => :json
      response.should be_success
      response.body.should =~ /note_html/
    end

    it 'succeeds on mobile' do
      get :index, :format => :mobile
      response.should be_success
    end
  end
end
