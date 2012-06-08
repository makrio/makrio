class IngredientsController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def create

    unique_session = env["rack.request.cookie_hash"]

    puts unique_session.inspect
    puts params[:session_id]

    puts unique_session == params[:session_id]

    render :nothing => true
  end
end