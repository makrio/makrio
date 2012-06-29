#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require File.join(Rails.root, "lib", "stream", "multi")
require File.join(Rails.root, "lib", "stream", "popular")


class StreamsController < ApplicationController
  respond_to :html,
             :mobile,
             :json

  def show
    stream_responder(Stream::Public)
  end

  def popular
    stream_responder(Stream::Popular)
  end

  def updated
    @posts = Post.where("id > ?", params[:last_post_id]).where(:featured => true).limit(25)
    respond_to do |format|
      format.json { render :json => PostPresenter.collection_json(@posts, current_user) }
    end
  end

  private

  def stream_responder(stream_klass)
    @stream = stream_klass.new(current_user, :max_time => max_time)
    stream_json = PostPresenter.collection_json(@stream.stream_posts, current_user)
    respond_to do |format|
      format.html do
        authenticate_user!
        gon.stream = stream_json
        render :nothing => true, :layout => "post"
      end
      format.mobile {authenticate_user!; render 'layouts/main_stream' }
      format.json { render :json => stream_json }
    end
  end
end
