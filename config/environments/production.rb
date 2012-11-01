#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

Diaspora::Application.configure do
  # Settings specified here will take precedence over those in config/environment.rb

  # The production environment is meant for finished, "live" apps.
  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Specifies the header that your server uses for sending files
  #config.action_dispatch.x_sendfile_header = "X-Sendfile"

  config.active_support.deprecation = :notify

  # For nginx:
   config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect'

  # If you have no front-end server that supports something like X-Sendfile,
  # just comment this out and Rails will serve the files

  # See everything in the log (default is :info)
  # config.log_level = :debug

  # Use a different logger for distributed setups
  # config.logger = SyslogLogger.new

  # Use a different cache store in production
  # config.cache_store = :mem_cache_store

  # Disable Rails's static asset server
  # In production, Apache or nginx will already do this
  config.serve_static_assets = false


  # Enable serving of images, stylesheets, and javascripts from an asset server
  if ENV['ASSET_HOST']
    config.action_controller.asset_host = ENV['ASSET_HOST']
  end

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false

  # Compress JavaScript and CSS
  config.assets.compress = true

  # Don't fallback to assets pipeline
  config.assets.compile = false

  # Generate digests for assets URLs
  config.assets.digest = true

  config.threadsafe!


 config.middleware.insert_before(Rack::Lock, Rack::Block) do  
  ips = ["90.21.93.220", "90.21.220.106", "90.44.151.94", "90.21.224.6", "90.44.224.170", "90.44.236.83", "90.21.231.138"]
  ips.each do |ip|
    ip_pattern ip do
      halt 404
    end
  end
 end
end

GC.enable_stats if GC.respond_to?(:enable_stats)
GC::Profiler.enable if defined?(GC::Profiler) && GC::Profiler.respond_to?(:enable)
