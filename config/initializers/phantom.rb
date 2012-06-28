if RUBY_PLATFORM.downcase.match(/darwin/)
  PHANTOM_PATH = 'phantomjs'
else
  phantom15 = 'http://phantomjs.googlecode.com/files/phantomjs-1.5.0-linux-x86_64-dynamic.tar.gz'
  phantom16 = 'http://phantomjs.googlecode.com/files/phantomjs-1.6.0-linux-x86_64-dynamic.tar.bz2'
  `[ -f #{Rails.root}/vendor/phantomjs/ChangeLog ] &&  echo "Phantom is Loaded" || (cd #{Rails.root}/vendor && curl #{phantom16} | tar xvj)`
  PHANTOM_PATH = '/app/vendor/phantomjs/bin/phantomjs'
end