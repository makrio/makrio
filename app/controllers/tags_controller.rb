class TagsController < ApplicationController

  before_filter :redirect_unless_admin
  def set
    post = Post.find(params[:conversation_id])
    post.update_tags!(params['tag_list'])
    redirect_to :back
  end
end