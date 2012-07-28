class InfosController < ApplicationController
  def about
    render :nothing => true, :layout => 'post'
  end
end