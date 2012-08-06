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
      display_name: @tag.name.titleize.gsub("-", " "),
      description: @tag.description,
      title: "Come play with me and #{@tag.name} on Makr.io!",

      remix_count: remix_count,
      likes_count: likes_count,
      makr_count: makr_count,
      comment_count: comment_count,
      latest_post_screenshot: latest_post_screenshot
    }

    if opts.fetch(:with_people, true)
      base.merge!({
        makrs: makrs
      })
    end
    base
  end

  def latest_post_screenshot
    post = base_scope.with_screenshot.order('created_at desc').first
    post ? post.screenshot_url : nil
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
    @base_scope ||= StatusMessage.tagged_with(@tag.name).featured_and_by_author(@current_user.try(:person))
  end
end
