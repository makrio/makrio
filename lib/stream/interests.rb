# Copyright (c) 2010-2011, Diaspora Inc. This file is
# licensed under the Affero General Public License version 3 or later. See
# the COPYRIGHT file.

class Stream::Interests < Stream::Base
  def link(opts={})
  end

  def title
    ""
  end

  # @return [ActiveRecord::Association<Post>] AR association of posts
  def posts
    @posts ||= @user.posts_from_topics_liked
  end

  def contacts_title
    ""
  end
end
