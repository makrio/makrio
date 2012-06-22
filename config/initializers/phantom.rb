if RUBY_PLATFORM.downcase.match(/darwin/)
  PHANTOM_PATH = 'phantomjs'
else
  `[ -f #{Rails.root}/vendor/phantomjs/ChangeLog] &&  echo "Phantom is Loaded" || (cd #{Rails.root}/vendor && curl http://phantomjs.googlecode.com/files/phantomjs-1.5.0-linux-x86_64-dynamic.tar.gz | tar zx)`
  PHANTOM_PATH = '/app/vendor/phantomjs/bin/phantomjs'
end