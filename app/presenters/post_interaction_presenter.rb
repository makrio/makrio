class PostInteractionPresenter
  def initialize(post, current_user=nil)
    @post = post
    @current_user = current_user
  end

  def as_json(options={})
    {
        :likes => as_api(@post.likes),
        :comments => CommentPresenter.as_collection(@post.comments.includes(:author => :profile).order("created_at ASC")),
        :remixes => RemixPresenter.as_collection(@post.remix_siblings.featured_and_by_author(@person).includes(:author => :profile).limit(3)),
        :comments_count => @post.comments_count,
        :likes_count => @post.likes_count,
        :remix_count => @post.remixes.count
    }
  end

  def as_api(collection)
    collection.includes(:author => :profile).all.map do |element|
      element.as_api_response(:backbone)
    end
  end

  class Lite
    def initialize(post, current_user=nil)
      @post = post
      @current_user = current_user
    end

    def as_json
      {
          :likes => [user_like].compact,
          :comments_count => @post.comments_count,
          :likes_count => @post.likes_count,
          :remix_count => @post.remixes.count
      }
    end

    def user_like
      @post.like_for(@current_user).try(:as_api_response, :backbone)
    end
  end
end
