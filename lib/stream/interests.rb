# Copyright (c) 2010-2011, Diaspora Inc. This file is
# licensed under the Affero General Public License version 3 or later. See
# the COPYRIGHT file.

class Stream::Interests
  def initialize(current_user, offset=0)
    @current_user = current_user
    @offset = offset
  end

  def posts
    @posts ||= @current_user.posts_from_topics_liked.distinct_ranked
  end

  def stream_posts
    self.posts.includes_for_a_stream.offset(@offset).limit(15)
  end
end
