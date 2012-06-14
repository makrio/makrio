#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module Jobs
  class ScreenshotPost < Base
    @queue = :screenshot
    def self.perform(post_id)
      Post.find(post_id).screenshot!
    end
  end
end
