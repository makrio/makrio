require 'spec_helper'

describe TagPresenter do
  it 'works' do
    tag = Factory(:tag)
    post = Factory(:status_message, :tag_list => tag.name)
    remix = Factory(:status_message, :parent_guid => post.guid, :root_guid => post.guid, :tag_list => tag.name)

    presenter = TagPresenter.new(tag, bob)
    presenter.stub(:latest_post_screenshot).and_return("http://assets.foo.com/cool_dude.gif")

    presenter.as_json
  end
end