class SearchsController < ApplicationController
  def show
    offset = params.fetch(:offset, 0)
    @posts = Post.search_by_text(params[:query]).includes_for_a_stream.limit(25).offset(offset)
    posts_json = PostPresenter.collection_json(@posts, current_user, :lite? => true)
    respond_to do |format|
      format.html do
        gon.stream = posts_json
        render :nothing => true, :layout => "post"
      end 

      format.json do
       render :json => posts_json
     end
    end 
  end
end