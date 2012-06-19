class BookmarkletsController < ApplicationController
  def show
    render 'show', :format => :js
  end
end