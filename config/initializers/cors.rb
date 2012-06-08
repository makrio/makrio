Rails.application.config.middleware.insert 0, Rack::Cors do
  allow do
    origins '*'
    resource '/.well-known/host-meta'
    resource '/webfinger'
    resource '/ingredients', :headers => :any, :methods => [:post, :options]
  end
end
