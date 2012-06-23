#   Copyright (c) 2012, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module PostsHelper
  def post_page_title(post, opts={})
    if post.is_a?(Photo)
      I18n.t "posts.show.photos_by", :count => 1
    elsif post.is_a?(Reshare)
      post_page_title(post.root)
    else
      if post.text.present?
        truncate(post.normalized_text, :length => opts.fetch(:length, 20))
      elsif post.respond_to?(:photos) && post.photos.present?
        I18n.t "posts.show.photos_by", :count => post.photos.size
      end
    end
  end

  def post_iframe_url(post_id, opts={})
    opts[:width] ||= 516
    opts[:height] ||= 315 
    host = AppConfig[:pod_uri].site
   "<iframe src='#{Rails.application.routes.url_helpers.post_url(post_id, :host => host)}' width='#{opts[:width]}px' height='#{opts[:height]}px' frameBorder='0'></iframe>".html_safe
  end
end
