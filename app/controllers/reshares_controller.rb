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
    signed_request = decode_data(params[:signed_request])
    render :json => {:redirect => signed_request["objects"].first["url"] + "/remix"}
  end

  protected

  def base64_url_decode str
    encoded_str = str.gsub('-','+').gsub('_','/')
    encoded_str += '=' while !(encoded_str.size % 4).zero?
    Base64.decode64(encoded_str)
  end

  def decode_data str
    encoded_sig, payload = str.split('.')
    data = ActiveSupport::JSON.decode base64_url_decode(payload)
  end
end
