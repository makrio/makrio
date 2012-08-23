class Notifications::AlsoRemixed < Notification
  def self.create_from_remix_notification(target, author)
    note = self.create! do |notification|
      notification.target = target
      notification.actors << target.author
      notification.recipient = author.owner
    end

    note.email!
    note
  end

  def mail_job
    Jobs::Mail::AlsoRemixed
  end

  def email!
    self.recipient.mail(mail_job, self.id)
  end

  def linked_object
    self.target
  end
  
  def popup_translation_key
    'notifications.also_remixed'
  end

  def deleted_translation_key
    'notifications.also_commented_deleted'
  end
end
