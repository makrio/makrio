#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require File.join(Rails.root, 'lib', 'stream', 'public')
class PublicsController < ApplicationController
  require File.join(Rails.root, '/lib/diaspora/parser')
  require File.join(Rails.root, '/lib/postzord/receiver/public')
  require File.join(Rails.root, '/lib/postzord/receiver/private')
  include Diaspora::Parser

  # We use newrelic_ignore to prevent artifical RPM bloat; however,
  # I am commenting this line out for the time being to debug some apparent
  # issues on Heroku.
  #
  # newrelic_ignore if EnviromentConfiguration.using_new_relic?

  skip_before_filter :set_header_data
  skip_before_filter :set_grammatical_gender
  before_filter :check_for_xml, :only => [:receive, :receive_public]
  before_filter :authenticate_user!, :only => [:index]

  respond_to :html
  respond_to :xml, :only => :post

  caches_page :host_meta, :if => Proc.new{ Rails.env == 'production'}

  layout false

  def hcard
    @person = Person.find_by_guid_and_closed_account(params[:guid], false)

    if @person.present? && @person.local?
      render 'publics/hcard'
    else
      render :nothing => true, :status => 404
    end
  end

  def host_meta
    render 'host_meta', :content_type => 'application/xrd+xml'
  end

  def webfinger
    @person = Person.local_by_account_identifier(params[:q]) if params[:q]

    if @person.nil? || @person.closed_account?
      render :nothing => true, :status => 404
      return
    end

    FEDERATION_LOGGER.info("webfinger profile request for :#{@person.id}")
    render 'webfinger', :content_type => 'application/xrd+xml'
  end

  def hub
    render :text => params['hub.challenge'], :status => 202, :layout => false
  end

  def receive_public
    raise("receiving public federated messages, shouldn't be happening")
  end

  def receive
    raise("receiving private federated messages, shouldn't be happening")
  end

  private

  def check_for_xml
    if params[:xml].nil?
      render :nothing => true, :status => 422
      return
    end
  end
end
