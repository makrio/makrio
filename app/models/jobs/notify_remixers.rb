#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module Jobs
  class NotifyRemixers < Base
    @queue = :receive_local

    require File.join(Rails.root, 'app/models/notification')

    def self.perform(note_id)
      note = Notifications::Remixed.find(note_id)
      note.notifiy_remixers
    end
  end
end
