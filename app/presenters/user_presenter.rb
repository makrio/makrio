class UserPresenter
  attr_accessor :user

  def initialize(user)
    self.user = user
  end

  def to_json(options = {})
    self.user.person.as_api_response(:backbone).update(
      { 
        :notifications_count => notifications_count,
        :admin => admin,
        :services => services,
        :configured_services => self.configured_services,
        :wallpaper => self.wallpaper,
        :getting_started => self.user.getting_started?
      }
    ).to_json(options)
  end

  def services
    ServicePresenter.as_collection(user.services)
  end

  def configured_services
    user.services.map{|service| service.provider }
  end

  def wallpaper
    user.person.profile.wallpaper.url
  end

  def aspects
    AspectPresenter.as_collection(user.aspects)
  end

  def notifications_count
    @notification_count ||= user.unread_notifications.count
  end

  def admin
    user.admin?
  end
end
