class PersonPresenter < BasePresenter
  def initialize(person, current_user = nil, opts = {})
    @person = person
    @current_user = current_user
    @opts = opts
  end

  def as_json(options={})
    attrs = @person.as_api_response(:backbone).merge(
        {
            :username => self.username,
            :is_own_profile => is_own_profile,
            :relationship => self.relationship,
            :followers => @person.followers_count,
            :following =>@person.followed_count 
        })

    if is_own_profile
      attrs.merge!(
        {
            :location => @person.profile.location,
            :birthday => @person.profile.formatted_birthday,
            :bio => @person.profile.bio
        })
    end

    attrs
  end

  def relationship
    return nil if @current_user.blank? || self.is_own_profile
    @current_user.person.relationship(@person)
  end

  def is_own_profile
    @current_user.try(:person) == @person
  end

  def username
    @person.diaspora_handle.split("@").first
  end
end