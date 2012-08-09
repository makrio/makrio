require File.join(File.dirname(__FILE__), '..', '..', 'lib', 'template_picker')

class PostPresenter
  include ActionView::Helpers::TextHelper
  attr_accessor :post, :current_user

  def initialize(post, current_user=nil)
    @post = post
    @current_user = current_user
    @person = @current_user.try(:person)
  end

  def self.collection_json(collection, current_user, opts={})
    collection.includes(:tags, :author => :profile).map {|post| self.new(post, current_user).as_json(opts)}
  end

  def as_json(options={})
    {
        :id => @post.id,
        :guid => @post.guid,
        :text => @post.raw_message,
        :plain_text => @post.plain_text,
        :public => @post.public,
        :featured => @post.featured,
        :created_at => @post.created_at,
        :staff_picked_at => @post.staff_picked_at,
        :interacted_at => @post.interacted_at,
        :provider_display_name => @post.provider_display_name,
        :tag_list => @post.tag_list.join(", "),
        :tags => @post.tags.as_json,
        :post_type => @post.post_type,
        :image_url => @post.image_url,
        :object_url => @post.object_url,
        :favorite => @post.favorite,
        :nsfw => @post.nsfw,
        :author => PersonPresenter.new(@post.author, current_user),
        :o_embed_cache => @post.o_embed_cache.try(:as_api_response, :backbone),
        :mentioned_people => [],#@post.mentioned_people.as_api_response(:backbone),
        :photos => @post.photos.map {|p| p.as_api_response(:backbone)},
        :frame_name => @post.frame_name || template_name,
        :parent => (options.fetch(:include_root, true) ? parent(options) : nil),
        :title => title,
        :next_post => next_post_path,
        :previous_post => previous_post_path,
        :screenshot_url => @post.screenshot_url,
        :screenshot_width => @post.screenshot_width,
        :screenshot_height => @post.screenshot_height,
        :show_screenshot => self.show_screenshot?,
        :has_gif => self.has_gif?,
        :conversation_id => @post.conversation_id,
        :conversation_name => self.conversation_title,
        :interactions => options.fetch(:lite?, false) ? lite_interactions : heavy_interactions,
        :original => @post.original?
    }
  end

  def next_post_path
    Rails.application.routes.url_helpers.next_post_path(@post)
  end

  def previous_post_path
    Rails.application.routes.url_helpers.previous_post_path(@post)
  end

  def heavy_interactions
    PostInteractionPresenter.new(@post, current_user).as_json
  end

  def lite_interactions
    PostInteractionPresenter::Lite.new(@post, current_user).as_json
  end

  def title
    @post.text.present? ? truncate(@post.plain_text, :length => 118) : I18n.translate('posts.presenter.title', :name => @post.author.name)
  end

  def conversation_title
    if @post.original?
      title
    elsif @post.root.present?
      # raise @post.inspect unless @post.root
     PostPresenter.new(@post.root, @current_user).title
    else
      "A cool story" #BAD
    end
  end

  def template_name #kill me, lol, I should be client side
    @template_name ||= TemplatePicker.new(@post).template_name
  end

  def parent(opts={})
    PostPresenter.new(@post.parent, current_user).as_json({:include_root => false}.merge(opts)) if @post.respond_to?(:parent) && @post.parent.present?
  end

  def show_screenshot?
    @post.screenshot_url.present? 
  end

  def has_gif?
    return false unless @post.photos.present?
    return 'gif' if @post.photos.detect{ |p| p.url && p.url.match(".gif") }.present?
  end

  protected

  def person
    @current_user.person
  end

  def user_signed_in?
    @current_user.present?
  end

end
