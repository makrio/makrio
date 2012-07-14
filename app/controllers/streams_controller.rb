#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

['conversations', 'staff_picks', 'likes', 'popular', 'catagory'].each do |filename|
  require File.join(Rails.root, "lib", "stream", filename)
end

class StreamsController < ApplicationController
  respond_to :html,
             :mobile,
             :json

  def show
    stream_responder do
      default_stream(Stream::Public)
    end
  end

  def conversations
    stream_responder do
      @stream = Stream::Conversations.new(current_user, :max_time => max_time)
      @stream_json = PostConversationPresenter.collection_json(@stream.stream_posts, current_user)
    end
  end

  def catagory
    @catagory = Catagory.find_by_name!(request.subdomain)

    stream_responder do
      @stream = Stream::Catagory.new(current_user, @catagory, :max_time => max_time)
      @stream_json = PostConversationPresenter.collection_json(@stream.stream_posts, current_user)
    end
  end

  def popular
    stream_responder do
      default_stream(Stream::Popular)
    end
  end

  def likes
    stream_responder do
      default_stream(Stream::Likes)
    end
  end

  def staff_picks
    stream_responder do
      default_stream(Stream::StaffPicks)
    end
  end
  
  def updated
    stream_responder do
      posts = Post.where("id > ?", params[:last_post_id]).where(:featured => true).limit(25)
      @stream_json = PostPresenter.collection_json(posts, current_user)
    end
  end

  private

  def default_stream(stream_klass)
    @stream = stream_klass.new(current_user, :max_time => max_time)
    @stream_json = PostPresenter.collection_json(@stream.stream_posts, current_user)
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
end
