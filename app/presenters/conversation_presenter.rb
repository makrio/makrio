class ConversationPresenter < BasePresenter
  def initialize(post, current_user=nil)
    @post = post
    @current_user = current_user
    @remix_siblings = @post.remix_siblings
    @person = @current_user.try(:person)
  end

  def as_json(opts = {})
    {
        :id => @post.id,
        :info => self.info_json,
        :original => self.original_json,
        :remix_siblings => self.remix_siblings_json,
        :most_liked => PostPresenter.new(self.most_liked, @current_user).as_json(lite?: true),
        :latest => PostPresenter.new(self.all_posts.last, @current_user).as_json(lite?: true)
    }
  end

  def original_json
    @original_json ||= PostPresenter.new(@post, @current_user).as_json(:lite => true)
  end

  def remix_siblings_json
    @remix_siblings_json ||= PostPresenter.collection_json(@remix_siblings, @current_user, :lite => true)
  end

  def likes_count
    @likes_count ||= all_posts.map(&:likes_count).sum
  end

  def all_posts
    @all_posts ||= @remix_siblings.unshift(@post)
  end

  def post_count
    @remix_siblings.count + 1
  end

  def most_liked
    all_posts.max{|a,b| a.likes_count <=> b.likes.count }
  end

  def people_liked
    likes = @remix_siblings.map(&:likes)
    @people_liked ||= Person.where(:id => likes.flatten.map(&:author_id))
  end

  def people_liked_json
    PersonPresenter.as_collection(self.people_liked)
  end

  def participants
    @participants ||= @post.remix_authors
  end

  def participants_json
    PersonPresenter.as_collection(self.participants).as_json
  end

  def info_json
    {
        :likes_count => self.likes_count,
        :people_liked => self.people_liked_json,
        :post_count => self.post_count,
        :participants_count => self.participants.count,
        :participants => self.participants_json,
        :created => @post.created_at
    }
  end
end