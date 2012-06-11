#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class NotificationsController < ApplicationController
  before_filter :authenticate_user!

  def update
    note = current_user.notifications.where(:id => params[:id]).first
    if note
      note.set_read_state(params[:set_unread] != "true" )

      respond_to do |format|
        format.json { render :json => { :guid => note.id, :unread => note.unread } }
      end

    else
      respond_to do |format|
        format.json { render :json => {}.to_json }
      end
    end
  end

  def index
    @notifications = current_user.recent_notifications.all

    @notifications.each do |n|
      n.note_html = render_to_string( :partial => 'notify_popup_item', :locals => { :n => n } )
    end
    @group_days = @notifications.group_by{|note| I18n.l(note.created_at, :format => I18n.t('date.formats.fullmonth_day')) }

    @unread_notification_count = current_user.unread_notifications.count

    respond_to do |format|
      format.html
      format.xml { render :xml => @notifications.to_xml }
      format.json { render :json => @notifications.to_json }
    end

  end

  def read_all
    current_user.notifications.mark_all_as_read!
    respond_to do |format|
      format.html { redirect_to stream_path }
      format.mobile{ redirect_to stream_path}
      format.xml { render :xml => {}.to_xml }
      format.json { render :json => {}.to_json }
    end
  end

end
