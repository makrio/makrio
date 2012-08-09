#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

%w{conversations staff_picks likes front_page category interests}.each do |filename|
  require File.join(Rails.root, "lib", "stream", filename)
end

class StreamsController < ApplicationController
  respond_to :html,
             :mobile,
             :json

  before_filter :set_current_path, :only => [:staff_picks, :show, :front_page, :interests]
  before_filter :set_getting_started!, :only => [:interests]
  before_filter :preload_getting_started

  def show
    stream_responder do
      lite = request.path =~ /timewarp/ ? {:lite =>true} : {}
      default_stream(Stream::Public, lite)
    end
  end

  def conversations
    stream_responder do
      @stream = Stream::Conversations.new(current_user, :max_time => max_time)
      @stream_json = PostConversationPresenter.collection_json(@stream.stream_posts, current_user)
    end
  end

  def category
    name  = request.subdomain.present? ? request.subdomain : params[:name]
    @category = Category.find_or_create_by_name!(name)

    #gross hax for open graph tags
    @post = @category
    stream_responder do
      @stream = Stream::Category.new(current_user, @category, :max_time => max_time)
      scope = @stream.stream_posts
      scope = scope.where('posts.id > ?', params[:last_post_id]) if params[:last_post_id].present?
      @stream_json = PostPresenter.collection_json(scope, current_user, lite?: true, include_root: false)
    end
  end

  def front_page
    stream_responder do
      @stream = Stream::FrontPage.new(current_user, params[:offset])
      @stream_json = PostPresenter.collection_json(@stream.stream_posts, current_user, lite?: true, include_root: false)
    end
  end

  def interests
    stream_responder do
      @stream = Stream::Interests.new(current_user, params[:offset])
      @stream_json = PostPresenter.collection_json(@stream.stream_posts, current_user, lite?: true, include_root: false)
    end
  end

  def likes
    stream_responder do
      default_stream(Stream::Likes, lite?: true, include_root: false)
    end
  end

  def staff_picks
    stream_responder do
      default_stream(Stream::StaffPicks, lite?: true, include_root: false)
    end
  end
  
  def updated
    stream_responder do
      posts = Post.where("id > ?", params[:last_post_id]).where(:featured => true).limit(25)
      @stream_json = PostPresenter.collection_json(posts, current_user)
    end
  end

  private

  def default_stream(stream_klass, opts={})
    @stream = stream_klass.new(current_user, :max_time => max_time)
    @stream_json = PostPresenter.collection_json(@stream.stream_posts, current_user, opts)
  end

  def stream_responder(&block)
    yield
    respond_to do |format|
      format.html do
        gon.stream = @stream_json
        render :nothing => true, :layout => "post"
      end
      format.mobile {authenticate_user!; render 'layouts/main_stream' }
      format.json {render :json => @stream_json }
    end
  end

  def preload_getting_started
    return unless current_user.getting_started?
    
    posts = Post.where(:id => [3080, 8883, 7572, 1587])
    gon.getting_started = PostPresenter.collection_json(posts, current_user, lite?: true, include_root: false)
  end
end
