module Jobs
  module Mail
    class AlsoRemixed < Base
      @queue = :mail
      def self.perform(note_id)
        note = Notification.find(note_id)
        Notifier.also_remixed(note.recipient.id, note.actors.first, note.target.id).deliver
      end
    end
  end
end
