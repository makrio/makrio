class RemixesController < ApplicationController
  before_filter :authenticate_user!, :except => :fb_create
  respond_to :json

  def fb_create
    fb_json = decode_data(params[:signed_request])
    render :json => {:redirect => fb_json["objects"].first["url"] + "/remix"}
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
