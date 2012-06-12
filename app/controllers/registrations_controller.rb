#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class RegistrationsController < Devise::RegistrationsController
  before_filter :check_registrations_open_or_vaild_invite!, :check_valid_invite!

  layout "post", :only => :new

  def create
    if session["devise.facebook_data"]
      params[:user].merge!({
        :email => session["devise.facebook_data"].info.email,
        :password => Devise.friendly_token[0,20]
      })
    end

    @user = User.build(params[:user])
    @user.process_invite_acceptence(invite) if invite.try(:present?)

    # set image url if this is from a FB login
    if session["devise.facebook_data"]
      @user.save # we need to save the user here before adjusting the user's profile

      # find and save service from uid
      service = Services::Facebook.find_by_uid_and_access_secret(session["devise.facebook_data"].uid, session["devise.facebook_data"].credentials.secret)
      service.user = @user
      service.save

      @user.reload.person.profile.image_url = session["devise.facebook_data"].info.image
      @user.person.profile.save
    end

    if @user.save
      flash[:notice] = I18n.t 'registrations.create.success'
      @user.seed_aspects
      Role.add_beta(@user.person)
      session["devise.facebook_data"] = nil if session["devise.facebook_data"] #only do this after create
      sign_in_and_redirect(:user, @user)
    else
      @user.errors.delete(:person)
      
      flash[:error] = @user.errors.full_messages.join(";")
      redirect_to new_user_registration_path, :error => flash[:error]
    end
  end

  def new
    #initializes a new user using devise magic, does User#new_with_session
    logger.info(session["devise.facebook_data"].present?)

    @fb_signup = session["devise.facebook_data"].present?
    super
  end

  private
  def check_valid_invite!
    return true unless AppConfig[:registrations_closed] #this sucks
    return true if invite && invite.can_be_used?
    flash[:error] = t('registrations.invalid_invite')
    redirect_to new_user_session_path
  end

  def check_registrations_open_or_vaild_invite!
    return true if invite.present?
    if AppConfig[:registrations_closed]
      flash[:error] = t('registrations.closed')
      redirect_to new_user_session_path
    end
  end

  def invite
    if params[:invite].present?
      @invite ||= InvitationCode.find_by_token(params[:invite][:token])
    end
  end
  
  helper_method :invite
end
