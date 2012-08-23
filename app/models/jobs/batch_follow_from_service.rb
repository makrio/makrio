#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.
#

module Jobs
  class BatchFollowFromService < Base
    @queue = :social
    def self.perform(service_id, notify = true)
      service = Service.find(service_id)
      service.follow_friends!(notify)
    end
  end
end