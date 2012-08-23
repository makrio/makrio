#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class ApplicationController < ActionController::Base
  has_mobile_fu
  protect_from_forgery :except => :receive

  before_filter :ensure_not_heroku
  before_filter :ensure_http_referer_is_set
  before_filter :set_locale
  before_filter :set_git_header if (AppConfig[:git_update] && AppConfig[:git_revision])
  before_filter :set_grammatical_gender
  before_filter :tablet_device_fallback
  # before_filter :set_notifications

  inflection_method :grammatical_gender => :gender

  helper_method :all_aspects,
                :all_contacts_count,
                :my_contacts_count,
                :only_sharing_count,
                :tag_followings,
                :tags

  def ensure_not_heroku
    if request.url.match(/heroku/)
      redirect_to 'https://makr.io' + request.path, :status => :moved_permanently
    end
  end

  def ensure_http_referer_is_set
    request.env['HTTP_REFERER'] ||= '/'
  end

  def all_aspects
    @all_aspects ||= current_user.aspects
  end

  def all_contacts_count
    @all_contacts_count ||= current_user.contacts.count
  end

  def my_contacts_count
    @my_contacts_count ||= current_user.contacts.receiving.count
  end

  def only_sharing_count
    @only_sharing_count ||= current_user.contacts.only_sharing.count
  end

  def tags
    @tags ||= current_user.followed_tags
  end

  def ensure_page
    params[:page] = params[:page] ? params[:page].to_i : 1
  end

  def set_git_header
    headers['X-Git-Update'] = AppConfig[:git_update] if AppConfig[:git_update].present?
    headers['X-Git-Revision'] = AppConfig[:git_revision] if AppConfig[:git_revision].present?
  end

  def set_locale
    if user_signed_in?
      I18n.locale = current_user.language
    else
      locale = request.preferred_language_from AVAILABLE_LANGUAGE_CODES
      locale ||= request.compatible_language_from AVAILABLE_LANGUAGE_CODES
      locale ||= DEFAULT_LANGUAGE
      I18n.locale = locale
    end
  end

  def redirect_unless_admin
    unless current_user && current_user.admin?
      redirect_to stream_url, :notice => 'you need to be an admin to do that'
      return
    end
  end

  def set_grammatical_gender
    if (user_signed_in? && I18n.inflector.inflected_locale?)
      gender = current_user.profile.gender.to_s.tr('!()[]"\'`*=|/\#.,-:', '').downcase
      unless gender.empty?
        i_langs = I18n.inflector.inflected_locales(:gender)
        i_langs.delete  I18n.locale
        i_langs.unshift I18n.locale
        i_langs.each do |lang|
          token = I18n.inflector.true_token(gender, :gender, lang)
          unless token.nil?
            @grammatical_gender = token
            break
          end
        end
      end
    end
  end

  def tablet_device_fallback
    request.format = :html if is_tablet_device?
  end

  def grammatical_gender
    @grammatical_gender || nil
  end

  def after_sign_in_path_for(resource)
    referrer = request.referrer.include?('users') ? root_url : request.referrer
    stored_location_for(:user) || request.env['omniauth.origin'] || referrer ||root_url
  end

  def max_time
    if params[:days_ago].present?
      params[:max_time] ||= params[:days_ago].to_i.days.ago.to_i
    end
    params[:max_time] ? Time.at(params[:max_time].to_i) : Time.now + 1
  end

  def flag
    @flag ||= FeatureFlagger.new(current_user)
  end

  def set_notifications
    if user_signed_in? && request.format.html?
      #we currently don't use this...
      #gon.notifications = NotificationsPresenter.as_collection(current_user.recent_notifications.where(:unread => true).limit(5), current_user)
    end
  end

  def set_current_path
    return unless user_signed_in?
    session[:saved_path] = request.path
  end
  
  def set_getting_started!
    if current_user && current_user.getting_started
      current_user.getting_started = false
      current_user.save
      queue_auto_follow_facebook_friends!
    end
  end

  def queue_auto_follow_facebook_friends!
    if fb = current_user.facebook
      Resque.enqueue(Jobs::BatchFollowFromService, fb.id)
    end
  end
end
