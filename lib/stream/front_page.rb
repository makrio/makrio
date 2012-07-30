# Copyright (c) 2010-2011, Diaspora Inc. This file is
# licensed under the Affero General Public License version 3 or later. See
# the COPYRIGHT file.

class Stream::FrontPage < Stream::Base
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
    # @posts ||= Post.order("(exp(posts.likes_count) + posts.comments_count*2 - (exp(extract(hour from age(created_at))/24))) DESC")

    # THE REDDIT ALGOOO <3333333333333 kent
    @posts ||= Post.featured_and_by_author(user.try(:person)).order("(ln( 1 + posts.likes_count) +  (EXTRACT(EPOCH FROM created_at) - 1327654606)/9000) desc")
  end

  def contacts_title
    ""
  end
end
