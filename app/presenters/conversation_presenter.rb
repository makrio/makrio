class ConversationPresenter < BasePresenter
  def initialize(post, current_user=nil)
    @post = post
    @current_user = current_user
    @remix_siblings = @post.remix_siblings
    @person = @current_user.try(:person)
  end

  def as_json(opts = {})
    {
        :info => self.info_json,
        :original => self.original_json,
        :remix_siblings => self.remix_siblings_json,
        :most_liked => self.most_liked,
        :latest => self.remix_siblings_json.last
    }
  end

  def original_json
    @original_json ||= PostPresenter.new(@post, @current_user).as_json(:lite => true)
  end

  def remix_siblings_json
    @remix_siblings_json ||= PostPresenter.collection_json(@remix_siblings, @current_user, :lite => true)
  end

  def likes_count
    @likes_count ||= @remix_siblings.map(&:likes_count).sum
  end

  def all_posts
    @all_posts ||= @remix_siblings.push(@post)
  end

  def post_count
    @remix_siblings.count + 1
  end

  def most_liked
    all_posts.max{|a,b| a.likes_count <=> b.likes.count }
  end

  def participants
    @participants ||= @post.remix_authors
  end

  def participants_json
    PersonPresenter.as_collection(self.participants).to_json
  end

  def info_json
    {
        :likes_count => self.likes_count,
        :post_count => self.post_count,
        :participants_count => self.participants.count,
        :participants => self.participants_json,
        :created => @post.created_at
    }
  end
end