class LastThreeCommentsDecorator
  def initialize(presenter, current_user)
    @current_user = current_user
    @presenter = presenter
  end

  def as_json(options={})
    @presenter.as_json.tap do |post|
      post[:interactions].merge!(:comments => CommentPresenter.as_collection(@presenter.post.last_three_comments, @current_user))
    end
  end
end