#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class HomeController < ApplicationController
  def show
    if current_user
      if is_mobile_device?
        redirect_to latest_path
        return
      end
      redirect_to saved_path
    else
      if is_mobile_device?
        redirect_to '/users/sign_in'
        return
      end

      # from StreamsController
      if user_signed_in?
        @stream = Stream::FrontPage.new(current_user, params[:offset])
        @stream_json = PostPresenter.collection_json(@stream.stream_posts, current_user, lite?: true) 
      else
        @category = Category.find_or_create_by_name!('testimonials')
        @stream = Stream::Category.new(current_user, @category, :max_time => max_time)
        scope = @stream.stream_posts
        scope = scope.where('posts.id > ?', params[:last_post_id]) if params[:last_post_id].present?
        @stream_json = PostPresenter.collection_json(scope, current_user, lite?: true, include_root: false)
      end
      gon.stream = @stream_json

      render :nothing => true, :layout => 'post'
    end
  end

  def toggle_mobile
   session[:mobile_view] = !session[:mobile_view]
    redirect_to :back
  end

  def saved_path
    session[:saved_path] || front_page_path
  end
end
