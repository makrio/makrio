# Copyright (c) 2010-2011, Diaspora Inc. This file is
# licensed under the Affero General Public License version 3 or later. See
# the COPYRIGHT file.

class Stream::StaffPicks < Stream::Base
  def link(opts={})
    Rails.application.routes.url_helpers.staff_picks_stream(opts)
  end

  def title
    I18n.translate("streams.like_stream.title")
  end

  # @return [ActiveRecord::Association<Post>] AR association of posts
  def posts
    @posts ||= Post.all_public.staff_picked.featured_and_by_author(self.user.try(:person)).reorder('posts.staff_picked_at desc')
  end

  def contacts_title
    I18n.translate('streams.like_stream.contacts_title')
  end
end
