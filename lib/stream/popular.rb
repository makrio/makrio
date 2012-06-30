# Copyright (c) 2010-2011, Diaspora Inc. This file is
# licensed under the Affero General Public License version 3 or later. See
# the COPYRIGHT file.

class Stream::Popular < Stream::Base
  def link(opts={})
    return nil
    Rails.application.routes.url_helpers.like_stream_path(opts)
  end

  def title
    ""
  end

  # @return [ActiveRecord::Association<Post>] AR association of posts
  def posts
    # we also need to factor in remixes here in the future
    # for increased performance, we should use a stored procedure
    @posts ||= Post.order("(exp(posts.likes_count) + posts.comments_count*2 - (exp(extract(hour from age(created_at))/24))) DESC")
  end

  def contacts_title
    ""
  end
end
