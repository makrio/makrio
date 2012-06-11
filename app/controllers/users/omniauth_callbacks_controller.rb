class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def facebook
    # You need to implement the method below in your model
    @user = User.find_for_facebook_oauth(request.env["omniauth.auth"])

    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "Facebook"
      sign_in_and_redirect @user, :event => :authentication
    else
      session["devise.facebook_data"] = request.env["omniauth.auth"]
      redirect_to new_user_registration_url
    end
  end

  def tumblr
    service
  end

  def twitter
    service
  end

  def service
     auth = request.env['omniauth.auth']

    toke = auth['credentials']['token']
    secret = auth['credentials']['secret']

    provider = auth['provider']
    user     = auth['info']

    service = "Services::#{provider.camelize}".constantize.new(:nickname => user['nickname'],
                                                               :access_token => toke,
                                                               :access_secret => secret,
                                                               :uid => auth['uid'])
    current_user.services << service

    if service.persisted?
      fetch_photo = current_user.person.profile[:image_url].blank?

      current_user.update_profile(current_user.person.profile.from_omniauth_hash(user))
      Resque.enqueue(Jobs::FetchProfilePhoto, current_user.id, service.id, user["image"]) if fetch_photo

      flash[:notice] = I18n.t 'services.create.success'
    else
      flash[:error] = I18n.t 'services.create.failure'

      if existing_service = Service.where(:type => service.type.to_s, :uid => service.uid).first
        flash[:error] <<  I18n.t('services.create.already_authorized',
                                 :diaspora_id => existing_service.user.person.profile.diaspora_handle,
                                 :service_name => provider.camelize )
      end
    end

    render :text => ("<script>window.close()</script>")
  end

  def passthru
    render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
    # Or alternatively,
    # raise ActionController::RoutingError.new('Not Found')
  end
end