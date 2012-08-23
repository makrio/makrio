class Notifications::Remixed < Notification
  def mail_job
    Jobs::Mail::Remixed
  end

  def self.create_from_post(post)
    return if post.author == post.parent.author # don't notify yourself.

    note = self.create! do |notification|
      notification.target = post
      notification.actors << post.author
      notification.recipient = post.parent.author.owner
    end

    note.notify_other_remixers!
    note.email!
    note
  end

  def notify_other_remixers!
    Resque.enqueue(Jobs::NotifyRemixers, self.id)
  end

  def notifiy_remixers
    #subtract all the people who have remixed the post
    #minus the person remixing, and the person who got the normal
    #remix notification
    authors = target.remix_authors.all - actors 
    authors = authors - [target.parent.author]

    authors.each do |author|
      Notifications::AlsoRemixed.create_from_remix_notification(target, author)
    end
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
