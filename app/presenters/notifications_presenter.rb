class NotificationsPresenter < BasePresenter
  def initialize(notification)
    @notification = notification
  end

  def as_json
    # we shouldn't have to do this if we have constraints!!
    return { :id => @notification.id } unless @notification.target.present?

    {
        :id => @notification.id,
        :people => PersonPresenter.as_collection(@notification.actors),
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
    @notification.is_a?(Notifications::Liked) ? "liked" : "commented on"
  end

  def icon_prefix
    @notification.is_a?(Notifications::Liked) ? "heart" : "comment"

  end
end