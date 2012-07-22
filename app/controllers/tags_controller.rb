class TagsController < ApplicationController
  before_filter :redirect_unless_admin
  def set
    post = Post.find(params[:post_id])
    post.update_tags!(params['tag_list'])
    redirect_to :back
  end

  def index
    @page = :experimental  #gross hax to get bootstrap
    @tags = ActsAsTaggableOn::Tag.all.sort{|x, y| x.taggings.count <=> y.taggings.count}.reverse
  end

  def show
    @tag = ActsAsTaggableOn::Tag.find_by_name(params[:name])
    render json: TagPresenter.new(@tag, current_user)
  end
end