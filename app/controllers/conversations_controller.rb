class ConversationsController < ApplicationController

  def show
    @original_post = Post.find(params[:id])

    respond_to do |format|
      format.html do
        presenter = ConversationPresenter.new(@original_post, current_user)
        gon.conversation = presenter
        render :nothing => true, :layout => "post"
      end 

      format.json do
       stream = @original_post.remix_siblings.for_a_stream(max_time, 'created_at', current_user)
       render :json => PostPresenter.collection_json(stream, current_user, :lite? => true)
     end
    end
  end
end
