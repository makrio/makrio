class Notifications::Followed < Notification
  def mail_job
    Jobs::Mail::Followed
  end

  def self.notify(actor, recipient)
    note = self.create! do |notification|
      notification.target = actor
      notification.actors << actor
      notification.recipient = Person.find(recipient).owner
    end

    note.email!
    note
  end

  def popup_translation_key
    'notifications.remixed'
  end

  def deleted_translation_key
    'notifications.post_deleted'
  end

  def email!
    self.recipient.mail(mail_job, self.id)
  end
end
