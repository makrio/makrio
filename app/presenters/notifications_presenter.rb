class NotificationsPresenter < BasePresenter
  def initialize(notification, current_user)
    @current_user = current_user
    @notification = notification
  end

  def as_json(opts ={})
    # we shouldn't have to do this if we have constraints!!
    return { :id => @notification.id } unless @notification.target.present?

    {
        :id => @notification.id,
        :people => PersonPresenter.as_collection(@notification.actors, @current_user),
        :post => PostPresenter.new(@notification.target),
        :action => action,
        :icon_prefix => icon_prefix,
        :time => @notification.created_at
    }
  end

  def to_json(options = {})
    as_json.to_json(options)
  end

  private

  def action
    case @notification.class.to_s
      when "Notifications::Liked"
        "liked"
      when "Notifications::Remixed"
        "remixed"
      else
        "commented on"
    end
  end

  def icon_prefix
    case @notification.class.to_s
      when "Notifications::Liked"
        "heart"
      when "Notifications::Remixed"
        "random"
      else
        "comment"
    end
  end
end