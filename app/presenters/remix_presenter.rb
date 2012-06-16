class RemixPresenter < BasePresenter
  attr_accessor :post, :current_user
  def initialize(post, current_user = nil)
    @post = post
    @current_user = current_user
  end

  def as_json(opts={})
    {
      :id => @post.id,
      :guid => @post.guid,
      :screenshot_url => @post.screenshot_url,
      :author => @post.author.as_api_response(:backbone),
      :root_guid => @post.root_guid
    }
  end
end