class CommentPresenter < BasePresenter
  def initialize(comment, current_user = nil)
    @comment = comment
  end

  def as_json(opts={})
    {
      id: @comment.id,
      text: @comment.text,
      author: PersonPresenter.new(@comment.author),
      created_at: @comment.created_at
    }
  end
end