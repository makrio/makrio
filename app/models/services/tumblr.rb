class Services::Tumblr < Service
  include ActionView::Helpers::TextHelper
  include ActionView::Helpers::TagHelper

  MAX_CHARACTERS = 1000

  def provider
    "tumblr"
  end

  def consumer_key
    SERVICES['tumblr']['consumer_key']
  end

  def consumer_secret
    SERVICES['tumblr']['consumer_secret']
  end

  def post(post, url='')

    consumer = OAuth::Consumer.new(consumer_key, consumer_secret, :site => 'http://tumblr.com')
    access = OAuth::AccessToken.new(consumer, self.access_token, self.access_secret)
    body = build_tumblr_post(post, url)
    begin
      resp = access.post('http://tumblr.com/api/write', body)
      resp
    rescue => e
      nil
    end
  end

  def build_tumblr_post(post, url)
    post_url = Rails.application.routes.url_helpers.post_url(post, :host => AppConfig[:pod_uri].host)
    profile_url = Rails.application.routes.url_helpers.person_url(post.author, :host => AppConfig[:pod_uri].host)
    {
      :generator => 'makr.io', 
      :type => 'photo', 
      'click-through-url' => post_url,
      'caption' => "made on <a href='https://www.makr.io'>makr.io</a> | <a href='#{post_url}/remix'>remix this</a>",
      :source => post.screenshot_url,
      :tags => "makr.io"
    }
  end
end
