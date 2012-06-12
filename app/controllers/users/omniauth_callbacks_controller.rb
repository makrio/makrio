class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  attr_reader :service
  def facebook
    @service = Services::Facebook.find_and_update_from_omniauth!(request.env["omniauth.auth"])
    @user = service.user

    if current_user
      associate_service_with_user
    else
      sign_in_or_register_user_from_facebook
    end
  end

  def tumblr
    @service = Services::Tumblr.find_and_update_from_omniauth!(auth)
    @user = @service.user

    if current_user
      associate_service_with_user
    else
      raise "login with tumblr not yet implemented"
    end
  end

  def twitter
    @service = Services::Twitter.find_and_update_from_omniauth!(auth)
    @user = @service.user

    if current_user
      associate_service_with_user
    else
      raise "login with tumblr not yet implemented"
    end
  end

  def passthru
    raise ActionController::RoutingError.new('Not Found')
  end

  protected

  def auth
    request.env["omniauth.auth"]
  end
  
  def associate_service_with_user
    if @user.present?
      validate_service_user_is_current_user
    else
      current_user.services << @service
      update_profile_from_omniauth
    end

    flash[:notice] = I18n.t 'services.create.success'
    render :text => ("<script>window.close()</script>")
  end

  def validate_service_user_is_current_user
    raise("changing the owner of a service from one user to another, this is messy") if @user.id != current_user.id
  end

  def update_profile_from_omniauth
    #current_user.update_profile(current_user.person.profile.from_omniauth_hash(user))
    fetch_photo = current_user.person.profile[:image_url].blank?
    Resque.enqueue(Jobs::FetchProfilePhoto, current_user.id, service.id, user["image"]) if fetch_photo
  end

  def sign_in_or_register_user_from_facebook
    if @user.present?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
      sign_in_and_redirect @user, :event => :authentication
    else
      auth = request.env["omniauth.auth"]
      raw = request.env["omniauth.auth"].extra.raw_info

      #TODO: change this key to be something like parsed_fb_data
      session["devise.facebook_data"] = {
          credentials: auth.credentials,
          name: raw[:name],
          email: raw[:email],
          uid: auth.uid,
          image: raw.image
      }

      redirect_to new_user_registration_url
    end
  end
end