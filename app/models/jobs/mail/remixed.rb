module Jobs
  module Mail
    class Remixed < Base
      @queue = :mail
      def self.perform(note_id)
        note = Notification.find(note_id)
        Notifier.remixed(note.recipient.id, note.actors.first, note.target.id).deliver
      end
    end
  end
end
