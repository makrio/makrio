#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class SessionsController < Devise::SessionsController

  layout "post", :only => [:new] #unless lambda{request.format == 'mobile'}

  def new
    @linking_service = session["devise.facebook_data"].present?
    super
  end

  def create
    fb_data = session["devise.facebook_data"]
    if fb_data
      service = Services::Facebook.find_by_uid_and_access_secret!(fb_data.uid, fb_data.credentials.secret)
    end

    super

    if service
      service.user = current_user
      service.save!
      raise("service connect botched") if service.reload.user_id.blank?
      logger.info("I am interested in your mother.")
      logger.info(current_user)
    end
  end

end