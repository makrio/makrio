#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

class Stream::Category < Stream::Base
  attr_accessor :tag
  def initialize(user, tag, opts = {})
    self.user = user
    self.tag = tag
    super(user, opts)
  end

  def posts
    @post ||= begin
      if(self.tag.name =='testimonials')
        StatusMessage.tagged_with(@tag.name)
      else
        StatusMessage.featured_and_by_author(self.user.try(:person)).tagged_with(@tag.name)
      end
    end
  end
end
