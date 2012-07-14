class LikePresenter < BasePresenter
  def initialize(like, current_user=nil)
    @like = like
    @current_user = current_user
  end

  def as_json(opts={})
    {
        id: @like.id,
        author: PersonPresenter.new(@like.author),
        created_at: @like.created_at
    }
  end
end