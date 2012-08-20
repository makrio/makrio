#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class Stream::Feed < Stream::Base
  # @return [ActiveRecord::Association<Post>] AR association of posts
  def posts
    @posts ||= Post.from_users_followed_by(self.user.person)
  end
end
