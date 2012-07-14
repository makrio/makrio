class CommentPresenter < BasePresenter
  def initialize(comment)
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