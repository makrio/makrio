class PostConversationPresenter < PostPresenter
  def as_json(opts={})
    super(opts.merge(:lite? => true)).merge(:conversation => ConversationPresenter.new(@post, @current_user).as_json(opts))
  end
end