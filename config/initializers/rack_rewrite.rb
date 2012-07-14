require 'rack-rewrite'

Rails.application.config.middleware.insert(0, Rack::Rewrite) do
  if AppConfig[:image_redirect_url].present?
    r301 %r{/uploads/images/(.*)}, "#{AppConfig[:image_redirect_url]}/uploads/images/$1"
    r301 %r{/screenshots/(.*)}, "#{AppConfig[:image_redirect_url]}/screenshots/$1"
    r301 %r{/landing/(.*)}, "#{AppConfig[:image_redirect_url]}/landing/$1"
  end

  r301 /.*/,  Proc.new {|path, rack_env| "http://#{rack_env['SERVER_NAME'].gsub(/www\./i, '') }#{path}" },
    :if => Proc.new {|rack_env| rack_env['SERVER_NAME'] =~ /www\./i}
end
