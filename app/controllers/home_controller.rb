#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class HomeController < ApplicationController
  def show
    if current_user
      redirect_to stream_path
    elsif is_mobile_device?
      unless(File.exist?("#{Rails.root}/app/views/home/_show.mobile.erb"))
        redirect_to user_session_path
      else
        render :show, :layout => 'post'
      end
    else
      @landing_page = true
      render :show, :layout => 'post'
    end
  end

  def toggle_mobile
   session[:mobile_view] = !session[:mobile_view]
    redirect_to :back
  end
end
