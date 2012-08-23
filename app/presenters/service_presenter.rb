class ServicePresenter < BasePresenter
  def initialize(service, current_user = nil)
    @service = service
  end

  def as_json(opts ={})
    {
      :provider => @service.provider,
      :access_token => @service.access_token
    }
  end

  def to_json(options = {})
    as_json.to_json(options)
  end
end