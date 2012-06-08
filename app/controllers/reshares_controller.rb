class ResharesController < ApplicationController
  before_filter :authenticate_user!
  respond_to :json

  def create
    #TODO make this use current_user.reshare! instead of having logic in the controller

    @reshare = current_user.build_post(:reshare, :root_guid => params[:root_guid])
    if @reshare.save
      current_user.add_to_streams(@reshare, current_user.aspects)
      current_user.dispatch_post(@reshare, :url => post_url(@reshare), :additional_subscribers => @reshare.root.author)

      current_user.open_graph_action('reshare', @reshare.root)
    end

    render :json => ExtremePostPresenter.new(@reshare, current_user), :status => 201
  end

  def fb_create
    Rails.loggger.info("PARAMS FROM FACEBOOK: #{params.inspect}")
    render :nothing => true, :response => 500
  end
end
