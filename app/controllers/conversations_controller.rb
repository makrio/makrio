class ConversationsController < ApplicationController
  before_filter :redirect_unless_admin, :only => [:join]
  
  def show
    @original_post = Post.find(params[:id])

    unless @original_post.original?
      redirect_to conversation_path(@original_post.root), :status => 301
      return
    end

    respond_to do |format|
      format.html do
        presenter = ConversationPresenter.new(@original_post, current_user)
        gon.conversation = presenter
        
        stream = @original_post.remix_siblings.for_a_stream(max_time, 'created_at', current_user)
        gon.stream =  PostPresenter.collection_json(stream, current_user, :lite? => true)
        render :nothing => true, :layout => "post"
      end 

      format.json do
       stream = @original_post.remix_siblings.for_a_stream(max_time, 'created_at', current_user)
       render :json => PostPresenter.collection_json(stream, current_user, :lite? => true)
     end
    end
  end

  def join
    @root_post = Post.find(params[:conversation_id])

    unless @root_post.original?
      redirect_to conversation_path(@root_post), :status => 301
      return
    end

    @root_post.attach_child_conversation!(params[:new_sibling])
    redirect_to :back
  end
end
