class PersonPresenter < BasePresenter
  def initialize(person, current_user = nil, opts = nil)
    @person = person
    @current_user = current_user
    @opts = opts
    puts opts.inspect
  end

  def as_json(options={})
    attrs = @person.as_api_response(:backbone).merge(
        {
            :username => self.username,
            :is_own_profile => is_own_profile
        })

    if is_own_profile
      attrs.merge!({
                      :location => @person.profile.location,
                      :birthday => @person.profile.formatted_birthday,
                      :bio => @person.profile.bio
                  })
    end

    if @opts[:post_counts]
      attrs.merge!({
                      :post_count => post_count
                  })
    end

    attrs
  end

  def post_count
    @opts[:post_counts].find{|x| x[0] == @person.id}[1]
  end

  def is_own_profile
    @current_user.try(:person) == @person
  end

  def username
    @person.diaspora_handle.split("@").first
  end
end