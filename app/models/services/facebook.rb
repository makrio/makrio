require 'uri'
class Services::Facebook < Service
  include Rails.application.routes.url_helpers

  OVERRIDE_FIELDS_ON_FB_UPDATE = [:contact_id, :person_id, :request_id, :invitation_id, :photo_url, :name, :username]
  MAX_CHARACTERS = 420

  def provider
    "facebook"
  end

  def post(post, url='')
    if post.parent_guid.present?
      open_graph_post("remix", post)
    else
      open_graph_post("make", post)
    end
  end

  def public_message(post, url)
    super(post, MAX_CHARACTERS, url)
  end

  def profile_photo_url
   "https://graph.facebook.com/#{self.uid}/picture?type=large&access_token=#{URI.escape(self.access_token)}"
  end

  def open_graph_post(action, post, opts={})
    post_to_facebook(og_action(action), create_open_graph_params(post, action, opts))
  end

  def queue_open_graph(action, post, opts={})
    Resque.enqueue(Jobs::PublishOpenGraph, self.id, post.id, action, opts)
  end

  def follow_friends!(notify = true)
    follower = self.user.person
    friends_who_use_makr!.each do |person_id|
      relationship = follower.follow(person_id)

      if relationship.new_record?
        Notifications::Followed.notify(follower, person_id) if notify
        relationship.save
      end
    end
  end

  private

  def friends_who_use_makr!
    Person.joins(:owner => :services).where(:services =>{:uid => friends_who_installed}).pluck('people.id')
  end

  def og_action(action)
    # use fb built-in like og action
    if is_like?(action)
      "https://graph.facebook.com/#{self.uid}/og.likes"
    else
      "https://graph.facebook.com/me/#{AppConfig[:open_graph_namespace]}:#{action}"
    end
  end

  def friends_who_installed
    json = JSON.parse(Faraday.get('https://graph.facebook.com/me/friends?fields=installed&access_token=' + access_token).body)
    json['data'].find_all{|x| x['installed']}.map{|x| x['id']}.compact
  end

  def post_to_facebook(url, body)
    Faraday.post(url, body)
  end

  def create_open_graph_params(post, action, opts={})
    key = (is_like?(action) ? :object : :frame)
    {key => "#{AppConfig[:pod_url]}#{short_post_path(post)}", :access_token => self.access_token}.merge(opts).to_param
  end

  def create_post_params(post)
    message = post.plain_text
    {:message => message, :access_token => self.access_token, :link => URI.extract(message, ['https', 'http']).first}.to_param
  end

  def is_like?(action)
    action.downcase == "like"
  end
end