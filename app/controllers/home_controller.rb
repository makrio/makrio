#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class HomeController < ApplicationController
  def show
    if current_user
      if is_mobile_device?
        redirect_to latest_path
        return
      end
      redirect_to front_page_path
    else
      if is_mobile_device?
        redirect_to '/users/sign_in'
        return
      end
      render :nothing => true, :layout => 'post'
    end
  end

  def toggle_mobile
   session[:mobile_view] = !session[:mobile_view]
    redirect_to :back
  end
end
