class Stream::Multi < Stream::Base

  # @return [String] URL
  def link(opts)
    Rails.application.routes.url_helpers.latest_path(opts)
  end

  # @return [String]
  def title
    I18n.t('streams.multi.title')
  end

  # @return [String]
  def contacts_title
    I18n.t('streams.multi.contacts_title')
  end

  def posts
    @posts ||= ::EvilQuery::MultiStream.new(user, order, max_time, include_community_spotlight?).make_relation!
  end

  #emits an enum of the groups which the post appeared
  # :spotlight, :aspects, :tags, :mentioned
  def post_from_group(post)
    streams_included.collect do |source|
      is_in?(source, post)
    end.compact
  end

  private

  # @return [Array<Symbol>]
  def streams_included
    @streams_included ||= lambda do
      array = [ :aspects, :followed_tags]
      array << :community_spotlight if include_community_spotlight?
      array
    end.call
  end

  # @return [Symbol]
  def is_in?(sym, post)
    if self.send("#{sym.to_s}_post_ids").find{|x| (x == post.id) || (x.to_s == post.id.to_s)}
      "#{sym.to_s}_stream".to_sym
    end
  end

  # @return [Boolean]
  def include_community_spotlight?
    AppConfig[:community_spotlight].present? && user.show_community_spotlight_in_stream?
  end
end
