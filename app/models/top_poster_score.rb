class TopPosterScore
  def initialize(author, query)
    @author = author
    @query = query
    @author_id = @author.id
  end

  def value 
    likes_count
  end

  def post_count
    @query.where(:author_id => @author_id).count
  end

  def likes_count # avg score of your liked post
    @query.where(:author_id => @author_id).sum(:likes_count)
  end
end