#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class Service < ActiveRecord::Base
  include ActionView::Helpers::TextHelper

  belongs_to :user
  validates_uniqueness_of :uid, :scope => :type

  def self.titles(service_strings)
    service_strings.map{|s| "Services::#{s.titleize}"}
  end

  def public_message(post, length, url = "")
    Rails.logger.info("Posting out to #{self.class}")
    url = Rails.application.routes.url_helpers.short_post_url(post, :host => AppConfig[:pod_uri].authority)
    space_for_url = 21 + 1
    truncated = truncate(post.text(:plain_text => true), :length => (length - space_for_url))
    truncated = "#{truncated} #{url}"
    return truncated
  end


  def profile_photo_url
    nil
  end


  def self.find_and_update_from_omniauth!(auth)
    service = find_by_uid(auth.uid) || new(:uid => auth.uid)
    service.nickname = auth.info.nickname
    service.access_token = auth.credentials.token
    service.access_secret = auth.credentials.secret
    service.save!
    service
  end

end
require File.join(Rails.root, 'app/models/services/facebook')
require File.join(Rails.root, 'app/models/services/twitter')
