class Notifications::Remixed < Notification
  def mail_job
    Jobs::Mail::Remixed
  end

  def self.create_from_post(post)
    note = self.create! do |notification|
      notification.target = post
      notification.actors << post.author
      notification.recipient = post.parent.author.owner
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

  def linked_object
    self.target
  end

  def email!
    self.recipient.mail(mail_job, self.id)
  end
end
