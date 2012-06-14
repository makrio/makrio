module Jobs
  module Mail
    class Welcome < Base
      @queue = :mail
      def self.perform(user_id)
        user = User.find(user_id)
        Notifier.welcome(user)
      end
    end
  end
end
