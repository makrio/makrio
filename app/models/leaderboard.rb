class Leaderboard
  def initialize(tag_name)
    @tag_name = tag_name
  end

  def as_json(opts={})
    {
      :top_posters => top_posters_json,
      :top_original_poster => top_poster,
      :top_remixer => top_remixer,
      :top_posters => top_posters_data
    }
  end

  def top_posters_json
    Person.where(:id => top_posters).limit(10).map{|p| PersonPresenter.new(p, nil, :post_counts =>top_posters_data )}
  end

  def top_orignal_poster
   p_id =  mode(original_posts_scope.pluck(:author_id))
   Person.find(p_id)
  end

  def total_authors
    (children_post_author_ids + original_post_author_ids)
  end

  def aggregate(id_hash)
    hash = Hash.new(0)
    total_authors.each do |x|
      hash[x] +=1
    end
    hash.sort_by{|id, count| count}.reverse
  end

  def top_posters_data
    @top_posters_data ||= aggregate(total_authors)
  end

  def top_remix_data
    @top_remix_data ||= aggregate(children_post_author_ids)
  end

  def top_original_post_data
    @top_original_data ||= aggregate(children_post_author_ids)
  end

  def top_posters
    top_posters_data.map{|x| x[0]}
  end

  def top_posters_count
    top_posters_data.map{|x| x[1]}
  end

  def top_remixer
    p_id = mode(children_post_author_ids)
    Person.find(p_id)
  end

  def all_posts_scope
    Post.where(:root_guid => original_post_guids) | Post.where(:guid => original_post_guids)
  end

  def by_likes
    all_posts_scope.order('posts.likes_count desc')
  end

  # private
  # select authors in conversation sorted_by (conversation.posts.author.id = author.id ).count, desc) 
  def children_post_author_ids
    @cpa_id ||= children_posts_scope.pluck(:author_id)
  end

  def original_post_author_ids
    @opa_id ||= original_posts_scope.pluck(:author_id)
  end

  def original_posts_scope
    @og_posts ||= StatusMessage.tagged_with(@tag_name)
  end

  def original_post_guids
    @og_posts_guid ||= original_posts_scope.pluck('posts.guid')
  end

  def children_posts_scope
    Post.where(:root_guid => original_post_guids)
  end

  def grouping(array)
    array.group_by{|i| i}
  end

  def mode(array) 
    grouping(array).max{|x,y| x[1].length <=> y[1].length}[0]
  end
end