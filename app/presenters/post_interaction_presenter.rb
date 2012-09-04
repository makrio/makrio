class PostInteractionPresenter
  def initialize(post, current_user=nil)
    @post = post
    @current_user = current_user
  end

  def as_json(options={})
    {
        :likes => LikePresenter.as_collection(@post.likes.includes(:author => :profile), @current_user),
        :comments => CommentPresenter.as_collection(@post.comments.includes(:author => :profile).order("created_at ASC"), @current_user),
        :remixes => RemixPresenter.as_collection(@post.remix_siblings.featured_and_by_author(@person).includes(:author => :profile).limit(3), @current_user),
        :comments_count => @post.comments_count,
        :likes_count => @post.likes_count,
        :remix_count => @post.remixes.count,
        :aggregate_count => @post.comments_count + @post.likes_count + @post.remixes.count,
        :tag_list => @post.tag_list
    }
  end

  class Lite
    def initialize(post, current_user=nil)
      @post = post
      @current_user = current_user
    end

    def as_json
      {
          likes: [user_like].compact,
          comments_count: @post.comments_count,
          likes_count: @post.likes_count,
          remix_count: @post.remixes.count,
          :aggregate_count => @post.comments_count + @post.likes_count + @post.remixes.count,
      }
    end

    def user_like
      like = @post.like_for(@current_user)
      LikePresenter.new(like, @current_user) if like
    end
  end
end
