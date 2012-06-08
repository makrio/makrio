module User::SocialActions
  def participate!(target, opts={})
    Participation::Generator.new(self, target).create!(opts)
  end

  def comment!(target, text, opts={})
    find_or_create_participation!(target)
    comment = Comment::Generator.new(self, target, text).create!(opts)
    open_graph_action('comment', target, :text => text)
    comment
  end

  def like!(target, opts={})
    target || raise("liking needs a target")
    find_or_create_participation!(target)
    like = Like::Generator.new(self, target).create!(opts)
    open_graph_action('love', target)
    like
  end

  def reshare!(target, opts={})
    find_or_create_participation!(target)
    reshare = build_post(:reshare, :root_guid => target.guid)
    reshare.save!
    Postzord::Dispatcher.defer_build_and_post(self, reshare)

    open_graph_action('reshare', target)

    reshare
  end

  def build_comment(options={})
    target = options.delete(:post)
    Comment::Generator.new(self, target, options.delete(:text)).build(options)
  end

  def find_or_create_participation!(target)
    participations.where(:target_id => target).first || participate!(target)
  end

  def open_graph_action(action, target, opts={})
    if facebook = facebook_connection
      facebook.queue_open_graph(action, target, opts)
    end
  end

  private

  def facebook_connection
    self.services.find_by_type("Services::Facebook")
  end
end