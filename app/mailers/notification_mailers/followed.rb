module NotificationMailers
  class Followed < NotificationMailers::Base
    attr_accessor :follower

    def set_headers
      @headers[:subject] = "#{@sender.name} followed you on Makr.io"
    end
  end
end