class InfosController < ApplicationController
  def about
    render :nothing => true, :layout => 'post'
  end

  def pro_tips
    about
  end

  def getting_started
    about
  end

end