#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class Reshare < Post

  belongs_to :parent, :class_name => 'Post', :foreign_key => :parent_guid, :primary_key => :guid
  validate :parent_must_be_public
  attr_accessible :parent_guid, :public
  validates_presence_of :parent, :on => :create
  validates_uniqueness_of :parent_guid, :scope => :author_id

  xml_attr :parent_diaspora_id
  xml_attr :parent_guid

  before_validation do
    self.public = true
  end

  after_create do
    self.parent.update_reshares_counter
  end

  after_destroy do
    self.parent.update_reshares_counter if self.parent.present?
  end

  def parent_diaspora_id
    self.parent.author.diaspora_handle
  end

  def o_embed_cache
    self.parent ? parent.o_embed_cache : super
  end

  def raw_message
    self.parent ? parent.raw_message : super
  end

  def mentioned_people
    self.parent ? parent.mentioned_people : super
  end

  def photos
    self.parent ? parent.photos : []
  end

  def frame_name
    self.parent ? parent.frame_name : nil
  end

  def receive(recipient, sender)
    local_reshare = Reshare.where(:guid => self.guid).first
    if local_reshare && local_reshare.parent.author_id == recipient.person.id
      return unless recipient.has_contact_for?(sender)
    end
    super(recipient, sender)
  end

  def comment_email_subject
    I18n.t('reshares.comment_email_subject', :resharer => author.name, :author => parent.author.name)
  end

  def notification_type(user, person)
    Notifications::Reshared if parent.author == user.person
  end

  def nsfw
    parent.try(:nsfw)
  end


  private

  def after_parse
    parent_author = Webfinger.new(@parent_diaspora_id).fetch
    parent_author.save! unless parent_author.persisted?

    return if Post.exists?(:guid => self.parent_guid)

    fetched_post = self.class.fetch_post(parent_author, self.parent_guid)

    if fetched_post
      #Why are we checking for this?
      if parent_author.diaspora_handle != fetched_post.diaspora_handle
        raise "Diaspora ID (#{fetched_post.diaspora_handle}) in the parent does not match the Diaspora ID (#{parent_author.diaspora_handle}) specified in the reshare!"
      end

      fetched_post.save!
    end
  end

  # Fetch a remote public post, used for receiving reshares of unknown posts
  # @param [Person] author the remote post's author
  # @param [String] guid the remote post's guid
  # @return [Post] an unsaved remote post or false if the post was not found
  def self.fetch_post author, guid
    url = author.url + "/p/#{guid}.xml"
    response = Faraday.get(url)
    return false if response.status == 404 # Old pod, friendika
    raise "Failed to get #{url}" unless response.success? # Other error, N/A for example
    Diaspora::Parser.from_xml(response.body)
  end

  def parent_must_be_public
    if self.parent && !self.parent.public
      errors[:base] << "Only posts which are public may be reshared."
      return false
    end
  end
end
