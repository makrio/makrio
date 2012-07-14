#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class StatusMessage < Post

  include PeopleHelper

  acts_as_taggable

  validates_length_of :text, :maximum => 65535, :message => I18n.t('status_messages.too_long', :count => 65535)
  
  xml_name :status_message
  xml_attr :raw_message

  # a StatusMessage is federated before its photos are so presence_of_content() fails erroneously if no text is present
  # therefore, we put the validation in a before_destory callback instead of a validation
  before_destroy :presence_of_content

  attr_accessible :text, :provider_display_name, :frame_name
  attr_accessor :oembed_url

  after_create :queue_gather_oembed_data, :if => :contains_oembed_url_in_text?

  def self.guids_for_author(person)
    Post.connection.select_values(Post.where(:author_id => person.id).select('posts.guid').to_sql)
  end

  def self.user_tag_stream(user, tag_ids)
    owned_or_visible_by_user(user).
      tag_stream(tag_ids)
  end

  def self.public_tag_stream(tag_ids)
    all_public.
      tag_stream(tag_ids)
  end

  def text(opts = {})
    self.formatted_message(opts)
  end

  def raw_message
    read_attribute(:text)
  end

  def raw_message=(text)
    write_attribute(:text, text)
  end


  def nsfw
    self.raw_message.match(/#nsfw/i) || super
  end

  def formatted_message(opts={})
    return self.raw_message unless self.raw_message

    opts[:plain_text] ?  plain_text : ERB::Util.h(self.raw_message)
  end

  def notify_person(person)
  end

  def after_dispatch(sender)
    self.update_and_dispatch_attached_photos(sender)
  end

  def update_and_dispatch_attached_photos(sender)
    if self.photos.any?
      self.photos.update_all(:public => self.public)
    end
  end

  def comment_email_subject
    formatted_message(:plain_text => true)
  end

  def text_and_photos_blank?
    self.text.blank? && self.photos.blank?
  end

  def queue_gather_oembed_data
    Resque.enqueue(Jobs::GatherOEmbedData, self.id, self.oembed_url)
  end

  def contains_oembed_url_in_text?
    require 'uri'
    urls = URI.extract(self.raw_message, ['http', 'https'])
    self.oembed_url = urls.find{ |url| !TRUSTED_OEMBED_PROVIDERS.find(url).nil? }
  end


  protected
  def presence_of_content
    unless text_and_photos_blank?
      errors[:base] << "Cannot destory a StatusMessage with text and/or photos present"
    end
  end

  private
  def self.tag_stream(tag_ids)
    joins(:tags).where(:tags => {:id => tag_ids})
  end
end

