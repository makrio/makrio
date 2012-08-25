require 'sidekiq'


if !AppConfig.single_process_mode?

  options = {:namespace => 'makrio'}
  url = ENV["REDISTOGO_URL"] || AppConfig[:redis_url]
  options.merge!(:url => url) if url.present?

  Sidekiq.configure_server do |config|
    config.redis = options
  end

  Sidekiq.configure_client do |config|
    config.redis =  options.merge(:size => 1 )
  end
end

# Single process-mode hooks using Resque.inline
if AppConfig.single_process_mode?
  if Rails.env == 'production'
    puts "WARNING: You are running Diaspora in production without Resque workers turned on.  Please don't do this."
  end
  require 'sidekiq/testing/inline'
end

