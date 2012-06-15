web: bundle exec thin start -p $PORT
redis: redis-server
worker: env QUEUE=* bundle exec rake resque:work