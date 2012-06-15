module OpenGraphHelper
  def og_title(post)
    meta_tag_with_property('og:title', post_page_title(post, :length => 140))
  end

  def og_type(post)
    meta_tag_with_property('og:type', 'article')
  end

  def og_url(post)
    meta_tag_with_property('og:url', post_url(post))
  end

  def og_image(post)
    post.screenshot_url || meta_tag_with_property('og:image', default_image_url(post.author))
  end

  def og_author(post)
    meta_tag_with_property("#{AppConfig[:open_graph_namespace]}:author", post.author.name)
  end

  def og_site_name
    meta_tag_with_property('og:site_name', AppConfig[:pod_name])
  end

  def og_description(post)
    meta_tag_with_property('og:description', "#{post.author.name.split(/\W/).first} uses makr.io to collect inspiring things, generate new content, and inspire others to be makers too.")
  end

  def og_type
    meta_tag_with_property('og:type', og_namespace('frame'))
  end

  def og_namespace(object)
    namespace = AppConfig[:open_graph_namespace].present? ? AppConfig[:open_graph_namespace] : 'joindiaspora'
    "#{namespace}:frame"
  end

  def og_page_specific_tags(post)
    [og_title(post), og_type,
      og_url(post), og_image(post), 
      og_description(post),
      og_author(post)].join(' ').html_safe
  end

  def meta_tag_with_property(name, content)
    content_tag(:meta, '', :property => name, :content => content)
  end

  private

  # This method compensates for hosting assets off of s3
  def default_image_url(author)
    author.profile.image_url
  end
end