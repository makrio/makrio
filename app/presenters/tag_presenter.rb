class TagPresenter < BasePresenter
  def initialize(tag, current_user, opts={})
    @tag = tag
    @current_user = current_user
    @opts = opts
  end

  def as_json(opts={})
    {
      id: @tag.id,
      name: @tag.name,
      on_fire: on_fire,
      most_posts: most_posts,
      most_remixes: most_remixes,
      likers: likers,
      makrs: makrs,
      remix_count: remix_count,
      likes_count: likers_count,
      makr_count: makr_count,
      comment_count: comment_count,
    }
  end

  def on_fire
    PersonPresenter.new(Person.offset(1).first, @current_user)
  end

  def most_posts
    PersonPresenter.new(Person.offset(4).first, @current_user)
  end

  def most_remixes
    PersonPresenter.new(Person.offset(11).first, @current_user)
  end

  def likers
     PersonPresenter.as_collection(Person.limit(5))
  end

  def makrs
     PersonPresenter.as_collection(Person.limit(5))
  end

  def remixers
   PersonPresenter.as_collection(Person.limit(5).offset(5))
  end

  def makr_count
    10
  end

  def likers_count
    11
  end

  def remix_count
    12
  end

  def comment_count
    54
  end
end