module Jobs
  module Mail
    class Followed < Base
      @queue = :mail
      def self.perform(note_id)
        note = Notification.find(note_id)
        Notifier.followed(note.recipient.id, note.actors.first).deliver
      end
    end
  end
end
