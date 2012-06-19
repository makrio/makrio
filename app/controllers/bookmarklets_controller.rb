class BookmarkletsController < ApplicationController
  before_filter :authenticate_user!

  def show
    @session_id = env["rack.request.cookie_hash"]["_diaspora_session"]

    #render :nothing => true
    render 'show', :format => :js
  end
end