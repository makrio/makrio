class UserPresenter
  def initialize(user)
    @user = user
  end

  def as_json(opts={})
    @user.person.as_api_response(:backbone).update(
      {
        admin: @user.admin?,
        services: self.services,
        username: @user.username,
        configured_services: self.configured_services,
        notifications_count: self.notifications_count
      }
    )
  end

  def services
    @services ||= ServicePresenter.as_collection(@user.services)
  end

  def configured_services
    @configured_services ||= @user.services.map(&:provider)
  end

  def notifications_count
    @notification_count ||= @user.unread_notifications.count
  end
end
