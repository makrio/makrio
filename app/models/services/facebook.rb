require 'uri'
class Services::Facebook < Service
  include Rails.application.routes.url_helpers

  OVERRIDE_FIELDS_ON_FB_UPDATE = [:contact_id, :person_id, :request_id, :invitation_id, :photo_url, :name, :username]
  MAX_CHARACTERS = 420

  def provider
    "facebook"
  end

  def post(post, url='')
    open_graph_post("make", post)
  end

  def public_message(post, url)
    super(post, MAX_CHARACTERS, url)
  end

  def profile_photo_url
   "https://graph.facebook.com/#{self.uid}/picture?type=large&access_token=#{URI.escape(self.access_token)}"
  end

  def open_graph_post(action, post, opts={})
    post_to_facebook(og_action(action), create_open_graph_params(post, opts))
  end

  def queue_open_graph(action, post, opts={})
    Resque.enqueue(Jobs::PublishOpenGraph, self.id, post.id, action, opts)
  end

  private

  def og_action(action)
    "https://graph.facebook.com/me/#{AppConfig[:open_graph_namespace]}:#{action}"
  end

  def post_to_facebook(url, body)
    Faraday.post(url, body)
  end

  def create_open_graph_params(post, opts={})
    {:frame => "#{AppConfig[:pod_url]}#{short_post_path(post)}", :access_token => self.access_token}.merge(opts).to_param
  end

  def create_post_params(post)
    message = post.text(:plain_text => true)
    {:message => message, :access_token => self.access_token, :link => URI.extract(message, ['https', 'http']).first}.to_param
  end
end