class TagsController < ApplicationController
  before_filter :authenticate_user!, :only => [:auth_show, :set]

  before_filter :set_current_path, :only => :top
  before_filter :set_getting_started!, :only => :top

  rescue_from ActiveRecord::RecordNotFound do
    render :file => "#{Rails.root}/public/404", :formats => [:html], :layout => false, :status => 404
  end

  respond_to :html, :js
  
  def set
    post = Post.find(params[:post_id])
    post.update_tags!(params['tag_list'].to_s.downcase)
    redirect_to :back
  end

  def index
    @page = :experimental  #gross hax to get bootstrap
    @tags = StatusMessage.most_popular_tags(1000) 
  end

  def show
    @tag = ActsAsTaggableOn::Tag.find_by_name!(params[:name].downcase)
    render json: TagPresenter.new(@tag, current_user)
  end

  def auth_show
    @tag = ActsAsTaggableOn::Tag.find_by_name!(params[:name])
    redirect_to "/tagged/#{@tag.name}"
  end


  def update
    @tag = ActsAsTaggableOn::Tag.find(params[:id])
    @tag.update_attributes(params[:acts_as_taggable_on_tag])
    render :nothing => true, :layout => false, :status => 201
  end

  def recently_popular
    @tags = StatusMessage.recently_popular_tags(25)

    respond_to do |format|
      format.js{render :json => TagPresenter.as_collection(@tags, current_user, :with_people => false)}
      format.html{ render :text => '', :layout => 'post'}
    end
  end
end