class ConversationsController < ApplicationController

  def show
    @original_post = Post.find(params[:id])

    presenter = ConversationPresenter.new(@original_post, current_user)

    gon.conversation = presenter
    gon.stream = presenter.remix_siblings_json

    respond_to do |format|
      format.html{render :nothing => true, :layout => "post"}
      format.json{ render :json => []}
    end
  end
end
