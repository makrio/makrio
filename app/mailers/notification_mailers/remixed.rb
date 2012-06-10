module NotificationMailers
  class Remixed < NotificationMailers::Base
    attr_accessor :remix

    def set_headers(new_remix_id)
      @remix = Post.find(new_remix_id)

      @headers[:subject] = I18n.t('notifier.remixed.remixed', :name => @sender.name)
    end
  end
end