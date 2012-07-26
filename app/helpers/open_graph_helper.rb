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
    meta_tag_with_property('og:image', post.screenshot_url)
  end

  def og_author(post)
    meta_tag_with_property("#{AppConfig[:open_graph_namespace]}:author", "https://makr.io/u/#{post.author.owner.username}")
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

  def og_namespace(object_type)
    namespace = AppConfig[:open_graph_namespace].present? ? AppConfig[:open_graph_namespace] : 'joindiaspora'
    "#{namespace}:#{object_type}"
  end

  def og_page_specific_tags(object)

    if object.is_a?(Post)
      og_post_tags(object)
    elsif object.is_a?(Person)
      og_profile_tags(object)
    elsif object.is_a?(ActsAsTaggableOn::Tag)
      og_tag_tags(object)
    end
  end

  def og_tag_tags(tag)
    image_url = tag.most_popular_post.try(:screenshot_url)
    tags = []
    tags << meta_tag_with_property("og:type", "article")
    tags << meta_tag_with_property("og:url", "https://makr.io/tagged/#{tag.name}")
    tags << meta_tag_with_property("og:image", image_url) if image_url.present?
    tags << meta_tag_with_property("og:title", tag.name + ' on Makr.io')
    tags << meta_tag_with_property("og:description", "An amazing collaborative collection of #{tag.name}")
    tags.join(' ').html_safe
  end

  def og_profile_tags(person)
    tags = []

    tags << meta_tag_with_property("og:type", "profile")
    tags << meta_tag_with_property("og:url", "https://makr.io/u/#{person.owner.username}")
    tags << meta_tag_with_property("og:image", person.profile.image_url(:scaled_full))
    tags << meta_tag_with_property("og:title", person.name)
    tags << meta_tag_with_property("og:description", "")

    if person.profile.first_name
      tags << meta_tag_with_property("profile:first_name", person.profile.first_name.split(/\s/).first)
      tags << meta_tag_with_property("profile:last_name", person.profile.first_name.split(/\s/).last)
    end

    tags << meta_tag_with_property("profile:username", person.owner.username)

    fb_service = person.owner.services.find_by_type("Services::Facebook")
    if fb_service
      tags << meta_tag_with_property("fb:profile_id", fb_service.uid)
    end

    tags.join(' ').html_safe
  end

  def og_post_tags(post)
    tags = []

    tags << og_title(post)
    tags << og_type
    tags << og_url(post)
    tags << og_image(post)
    tags << og_description(post)
    tags << og_author(post)

    if post.parent.present?
      tags << meta_tag_with_property("#{AppConfig[:open_graph_namespace]}:original_frame", "https://makr.io/p/#{post.parent.id}")
    end

    tags.join(' ').html_safe
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