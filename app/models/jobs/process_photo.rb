#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.


module Jobs
  class ProcessPhoto < Base
    @queue = :photos
    def perform(id)
      photo = Photo.find(id)

      # old way to process photos ie. via a normal file upload form
      if photo.unprocessed_image.path.present?
        unprocessed_image = photo.unprocessed_image
        return false if photo.processed? || unprocessed_image.path.try(:include?, ".gif")
        photo.processed_image.store!(unprocessed_image)
      else #new hotness, if a vaild URL is supplied with the photo
        photo.remote_processed_image_url = photo.temporary_url
        photo.processed_image.store!
      end

      photo.save!
    end
  end
end
