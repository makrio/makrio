web: bundle exec thin start -p $PORT
redis: redis-server
worker: env QUEUE=screenshot,* bundle exec rake resque:work