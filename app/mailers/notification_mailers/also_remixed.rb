module NotificationMailers
  class AlsoRemixed < NotificationMailers::Base
    attr_accessor :remix

    def set_headers(new_remix_id)
      @remix = Post.find(new_remix_id)

      @headers[:subject] ="#{@sender.name} remixed a post you also remixed!"
    end
  end
end