#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class Post < ActiveRecord::Base
  include ApplicationHelper

  include Diaspora::Federated::Shareable

  
  include ActionView::Helpers::TextHelper
  include Diaspora::Likeable
  include Diaspora::Commentable
  include Diaspora::Shareable

  has_many :participations, :dependent => :delete_all, :as => :target

  attr_accessor :user_like
  attr_accessible :tag_list

  xml_attr :provider_display_name

  has_many :mentions, :dependent => :destroy

  has_many :remixes, :class_name => "Post", :foreign_key => :parent_guid, :primary_key => :guid
  has_many :remixers, :class_name => 'Person', :through => :reshares, :source => :author

  has_many :photo_postings, :foreign_key => :post_id
  has_many :photos, :through => :photo_postings, :dependent => :destroy

  belongs_to :parent, :class_name => 'Post', :foreign_key => :parent_guid, :primary_key => :guid
  belongs_to :root, :class_name => 'Post', :foreign_key => :root_guid, :primary_key => :guid

  scope :all_original, where(:parent_guid => nil)

  belongs_to :o_embed_cache

  before_create :set_root_guid

  after_create do
    self.touch(:interacted_at)
  end

  include PgSearch
  pg_search_scope :search_by_text, :against => :text

  mount_uploader :screenshot, ScreenshotUploader
  #scopes
  scope :includes_for_a_stream, includes(:o_embed_cache, {:author => :profile}, :photos, :parent, :root) #note should include root and photos, but i think those are both on status_message


  scope :commented_by, lambda { |person|
    select('DISTINCT posts.*').joins(:comments).where(:comments => {:author_id => person.id})
  }

  scope :liked_by, lambda { |person|
    joins(:likes).where(:likes => {:author_id => person.id})
  }

  scope :recently_liked_by, lambda { |person, time = 1.week.ago|
    self.liked_by(person).where('likes.created_at > ?', time)
  }


  def self.from_users_followed_by(person)
      followed_person_ids = "SELECT followed_id FROM relationships
                          WHERE follower_id = :person_id"
      where("author_id IN (#{followed_person_ids}) OR author_id = :person_id", 
            person_id: person.id)
  end

  def add_gif_tag
    return false unless photos.present?

    if !tag_list.include?('gif') && photos.detect{ |p| p.url && p.url.match(".gif") }.present?
      tag_list << 'gif'
      save!
    end
  end 

  def self.ranked
    order("#{self.ranking_string} desc")
  end

  def self.distinct_ranked
    select("DISTINCT posts.*, #{StatusMessage.ranking_string} AS ranking").order("ranking desc")
  end

  def self.ranking_string
    "(ln( 1 + posts.likes_count) +  (EXTRACT(EPOCH FROM posts.created_at) - 1327654606)/9000)"
  end

  def self.with_screenshot
    where("screenshot IS NOT NULL")
  end

  def self.staff_picked
    where("staff_picked_at IS NOT NULL")
  end

  def self.newer(post)
    where("posts.created_at > ?", post.created_at).reorder('posts.created_at ASC').first
  end

  def self.older(post)
    where("posts.created_at < ?", post.created_at).reorder('posts.created_at DESC').first
  end

  def self.featured_and_by_author(author)
    scoped = where(:featured => true)
    author ? scoped | where(:author_id => author.id) : scoped
  end

  def self.visible_from_author(author, current_user=nil)
    if current_user.present?
      current_user.posts_from(author)
    else
      author.posts.all_public
    end
  end

  def self.created_since(time)
    where('posts.created_at > ?', time)
  end

  def toggle_featured!
    self.featured = !featured
    save!
  end

  def toggle_staff_picked!
    if staff_picked_at.present?
      self.staff_picked_at = nil
      self.save
    else
      self.touch(:staff_picked_at)
    end
  end

  def set_absolute_root!
    self.root = absolute_root
    self.save!
  end

  def remix_siblings
    base_guid = original? ? guid : self.root_guid
    @remix_siblings ||= Post.where(:root_guid => base_guid).where("posts.guid <> '#{self.guid}'").order("created_at DESC")
  end

  def remix_authors
    @remix_authors ||= Person.where(:id => remix_siblings.pluck(:author_id).push(self.author_id)).select("DISTINCT people.*")
  end

  def absolute_root
    return nil if parent_guid.blank?

    current = self
    while(current.parent.present?)
      current = current.parent
    end

    current
  end

  def set_root_guid
    return true if original?

    if self.parent.original?
      self.root_guid = self.parent.guid
    else
      self.root_guid = self.parent.root_guid
    end
  end

  def conversation_id
    self.original? ? self.id : root.try(:id)
  end

  def original?
    parent_guid.blank? && root_guid.blank?
  end

  def post_type
    self.class.name
  end

  def raw_message; ""; end
  def mentioned_people; []; end
  def text(opts={}); raw_message; end


  def plain_text
    message = raw_message.gsub(/<br>/, ' ')
    sanitize(message, :tags=>[]).gsub(/&nbsp;/i, ' ').squish
  end

  def self.excluding_blocks(user)
    people = user.blocks.map{|b| b.person_id}
    scope = scoped

    if people.any?
      scope = scope.where("posts.author_id NOT IN (?)", people)
    end

    scope
  end
  
  def attach_photos_by_ids(photo_ids)
    return [] unless photo_ids.present?
    self.photos << Photo.where(:id => photo_ids).all
  end

  def self.excluding_hidden_shareables(user)
    scope = scoped
    if user.has_hidden_shareables_of_type?
      scope = scope.where('posts.id NOT IN (?)', user.hidden_shareables["#{self.base_class}"])
    end
    scope
  end

  def self.excluding_hidden_content(user)
    excluding_blocks(user).excluding_hidden_shareables(user)
  end

  def self.for_a_stream(max_time, order, user=nil)
    scope = self.for_visible_shareable_sql(max_time, order).
      includes_for_a_stream

    scope = scope.excluding_hidden_content(user) if user.present?

    scope
  end

  def participation_for(user)
    return unless user
    participations.where(:author_id => user.person.id).first
  end

  def like_for(user)
    return unless user
    likes.where(:author_id => user.person.id).first
  end


  def update_tags!(tag_list)
    self.tag_list = tag_list
    save!
  end

  def attach_child_conversation!(conversation_id_or_url)
    c_id = conversation_id_or_url.split('/')[-1]
    new_sibling = Post.find(c_id)
    new_sibling.remix_siblings.each{|x| x.root = self; x.save}

    new_sibling.root = self
    new_sibling.parent = self
    new_sibling.save!
  end
  #############

  def self.diaspora_initialize(params)
    new_post = self.new params.to_hash
    new_post.author = params[:author]
    new_post.public = params[:public] if params[:public]
    new_post.parent_guid = params[:parent_guid]
    new_post.diaspora_handle = new_post.author.diaspora_handle
    new_post
  end

  # @return Returns true if this Post will accept updates (i.e. updates to the caption of a photo).
  def mutable?
    false
  end

  def notify_source!
    Notifications::Remixed.create_from_post(self) if self.parent.present?
  end

  def comment_email_subject
    I18n.t('notifier.a_post_you_shared')
  end

  def screenshot!
    return false if !self.persisted? || Rails.env.test?
    puts "screenshoting"
    if r = raw_screenshot
      self.screenshot.store!(r)
      self.save!
    else
      false
    end
  end

  def raw_screenshot
    Screencap::Fetcher.new(frame_url).fetch(:div => '.canvas-frame:first', :output => Rails.root.join('tmp', "#{self.guid}.jpg"))
  end

  def re_screenshot!
    puts "rescreenshoting"
    self.remove_screenshot!
    self.update_column(:screenshot, nil)
    self.save!
    self.screenshot!
  end

  def frame_url
    frame_url = AppConfig[:pod_url] + "posts/#{self.guid}/frame"
  end

  def screenshot_url
    screenshot.url
  end

  def re_screenshot_async
    Resque.enqueue(Jobs::Screenshot, id)
  end

  def nsfw
    self.author.profile.nsfw?
  end

  def self.find_by_guid_or_id_with_user(id, user=nil)
    key = id.to_s.length <= 8 ? :id : :guid
    post = if user
             user.find_visible_shareable_by_id(Post, id, :key => key)
           else
             Post.where(key => id, :public => true).includes(:author, :comments => :author).first
           end

    post || raise(ActiveRecord::RecordNotFound.new("could not find a post with id #{id}"))
  end
end
