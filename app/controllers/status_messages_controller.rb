#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class StatusMessagesController < ApplicationController
  before_filter :authenticate_user!

  respond_to :mobile,
             :json

  # REMOVE
  # Called when a user clicks "Mention" on a profile page
  # @param person_id [Integer] The id of the person to be mentioned
  def new
    @aspect_ids = []
  end

  def create
    normalize_public_flag!
    services = [*params[:services]].compact

    @status_message = current_user.build_post(:status_message, params[:status_message])
    @status_message.attach_photos_by_ids(params[:photos])

    if @status_message.save
      receiving_services = Service.titles(services)

      current_user.dispatch_post(@status_message, :url => short_post_url(@status_message.guid), :service_types => receiving_services)

      #this is done implicitly, somewhere else, but it doesnt work, says max. :'(
      @status_message.photos.each do |photo|
        current_user.dispatch_post(photo)
      end

      current_user.participate!(@status_message)

      respond_to do |format|
        format.mobile { redirect_to stream_path }
        format.json { render :json => PostPresenter.new(@status_message, current_user), :status => 201 }
      end
    else
      respond_to do |format|
        format.mobile { redirect_to stream_path }
        format.json { render :nothing => true , :status => 403 }
      end
    end
  end

  def normalize_public_flag!
    # mobile || desktop conditions
    sm = params[:status_message]
    public_flag = (sm[:aspect_ids] && sm[:aspect_ids].first == 'public') || sm[:public]
    public_flag.to_s.match(/(true)|(on)/) ? public_flag = true : public_flag = false
    params[:status_message][:public] = public_flag
    public_flag
  end
end
