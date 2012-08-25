#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.
#
module Jobs
  class PublishOpenGraph < Base
    @queue = :http_service

    def perform(service_id, post_id, action, opts={})
      service = Service.find_by_id(service_id)
      post = Post.find_by_id(post_id)
      service.open_graph_post(action, post, opts)
    end
  end
end
