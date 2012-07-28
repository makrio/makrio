#   Copyright (c) 2009, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class Photo < ActiveRecord::Base
  require 'carrierwave/orm/activerecord'

  include Diaspora::Federated::Shareable
  include Diaspora::Shareable

  # NOTE API V1 to be extracted
  acts_as_api
  api_accessible :backbone do |t|
    t.add :id
    t.add :guid
    t.add :created_at
    # t.add :author
    t.add lambda { |photo|
      { :small => photo.url(:thumb_small),
        :medium => photo.url(:thumb_medium),
        :large => photo.url(:scaled_full) }
    }, :as => :sizes
    t.add lambda { |photo|
      { :height => photo.height,
        :width => photo.width }
    }, :as => :dimensions
  end

  mount_uploader :processed_image, ProcessedImage
  mount_uploader :unprocessed_image, UnprocessedImage

  xml_attr :remote_photo_path
  xml_attr :remote_photo_name

  xml_attr :text

  xml_attr :height
  xml_attr :width

  has_many :photo_postings, :foreign_key => :post_id
  has_many :status_messages, :through => :photo_postings 

  attr_accessible :text

  validates_format_of :temporary_url, :with => URI::regexp(%w(http https)), :allow_nil => true

  before_destroy :ensure_user_picture

  after_create do
    queue_processing_job if self.author.local?
  end


  def self.diaspora_initialize(params = {})
    photo = self.new params.to_hash
    photo.author = params[:author]
    photo.public = params[:public] if params[:public]
    photo.diaspora_handle = photo.author.diaspora_handle

    photo.random_string = SecureRandom.hex(10)

    if params[:user_file]
      image_file = params.delete(:user_file)
      photo.unprocessed_image.store! image_file

    elsif params[:image_url]
      photo.temporary_url = params[:image_url]
    end

    photo
  end

  def processed?
    processed_image.path.present?
  end

  def old_file_upload?
    unprocessed_image.path.present? && temporary_url.blank? && !processed?
  end

  def base_url(opts = {})
    return unprocessed_image.url if old_file_upload?
    size = opts unless gif? 
    processed_image.url(size)
  end

  def gif?
    processed_image.url.try(:include?, 'gif') || temporary_url.to_s.include?('.gif')
  end

  def url(opts = {})
    #hostname + 
    base_url(opts)
  end

  def hostname
    ENV['ASSET_HOST'] || AppConfig[:pod_url].chop
  end

  def full_image_url
    if url(:thumb_large).starts_with?('/')
      hostname + url(:thumb_large)
    else
      url(:thumb_large) 
    end
  end

  #this is a gross h@x to fix out stupid profile images
  def self.find_from_filename(filename)
    Photo.find_by_random_string(filename.split('/').last.split('.').first)
  end
  
  def ensure_user_picture
    profiles = Profile.where(:image_url => full_image_url)
    profiles.each { |profile|
      profile.image_url = nil
      profile.save
    }
  end

  def queue_processing_job
    Resque.enqueue(Jobs::ProcessPhoto, self.id)
  end

  def mutable?
    true
  end

  scope :on_statuses, lambda { |post_guids|
    where(:status_message_guid => post_guids)
  }
end
