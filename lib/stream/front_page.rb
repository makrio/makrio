class Stream::FrontPage
  def initialize(current_user, offset=0)
    @current_user = current_user
    @offset = offset
  end

  def posts
    @posts ||= Post.where('posts.likes_count > ?', 3).featured_and_by_author(@current_user.try(:person)).ranked
  end

  def stream_posts
    self.posts.includes_for_a_stream.offset(@offset).limit(15)
  end
end
