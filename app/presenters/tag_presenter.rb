class TagPresenter < BasePresenter
  def initialize(tag, current_user, opts={})
    @tag = tag
    @current_user = current_user
    @opts = opts
  end

  def as_json(opts={})
    base = {
      id: @tag.id,
      name: @tag.name,

      remix_count: remix_count,
      likes_count: likes_count,
      makr_count: makr_count,
      comment_count: comment_count,
      last_three: last_three
    }

    if opts.fetch(:with_people, true)
      base.merge!({
        on_fire: on_fire,
        most_posts: most_posts,
        most_remixes: most_remixes,
        likers: likers,
        makrs: makrs,
      })
    end
    base
  end

  def last_three
    posts = base_scope.order('created_at desc').limit(3)
    PostPresenter.collection_json(posts, @current_user, lite?: true)
  end

  def on_fire
    on_fire = base_scope.order('likes_count desc').first.author
    PersonPresenter.new(on_fire, @current_user)
  end

  #totally faking this list
  def likers
    likers = base_scope.includes(:likes => {:author =>:profile}).order('created_at desc').limit(10).map do |post|
      post.likes.map(&:author)
    end.flatten.uniq
     PersonPresenter.as_collection(likers)
  end

  def most_posts
    person = Person.find(top_original_poster_id)
    PersonPresenter.new(person, @current_user)
  end

  def most_remixes
    person = Person.find(top_remixer_id)
    PersonPresenter.new(person, @current_user)
  end


  def makrs
    author_ids = base_scope.uniq.limit(20).pluck(:author_id)
    authors = Person.where(:id => author_ids).includes(:profile)
    PersonPresenter.as_collection(authors)
  end

  def makr_count
    base_scope.count(:author_id, :distinct => true)
  end

  def likes_count
    base_scope.sum(:likes_count)
  end

  def remix_count
    base_scope.count
  end

  def comment_count
    base_scope.sum(:comments_count)
  end

  private

  def base_scope
    StatusMessage.tagged_with(@tag.name)
  end

  def remix_author_ids
    base_scope.where('posts.parent_guid IS NOT NULL AND posts.root_guid IS NOT NULL').pluck(:author_id)
  end

  def original_author_ids
    base_scope.all_original.pluck(:author_id)
  end

  def top_remixer_id
    remix_author_ids.mode.first
  end

  def top_original_poster_id
    original_author_ids.mode.first
  end
end
