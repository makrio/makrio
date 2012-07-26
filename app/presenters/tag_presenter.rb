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
        makrs: makrs
      })
    end
    base
  end

  def last_three
    posts = base_scope.with_screenshot.order('created_at desc').limit(3)
    PostPresenter.collection_json(posts, @current_user, lite?: true)
  end

  def makrs
    author_ids = base_scope.pluck(:author_id)
    authors = Person.where(:id => author_ids).includes(:profile)
    sorted_authors =  authors.map{|x| [x, TopPosterScore.new(x, base_scope).value]}.sort{|x, y| y[1] <=> x[1]}.map{|x| x[0]}
    PersonPresenter.as_collection(sorted_authors, @current_user)
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
    StatusMessage.tagged_with(@tag.name).featured_and_by_author(@current_user.try(:person))
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
