#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module Jobs
  class FinalizePost < Base
    @queue = :screenshot
    def self.perform(user_id, object_class, object_id, opts)
      # screenshot first to ensure it's there before posting to services
      if !AppConfig.single_process_mode?
        Post.find(post_id).screenshot!
      end

      # post to services & notify participants of the thread
      Resque.enqueue(Jobs::DeferredDispatch, user_id, object_class, object_id, opts)
    end
  end
end
