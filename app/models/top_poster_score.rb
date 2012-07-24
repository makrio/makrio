class TopPosterScore
  def initialize(author, query)
    @author = author
    @query = query
  end


  def value 
    likes_count / post_count + 1
  end

  # def value
  #   post_sum + likes_score
  # end


  # def original_score
  #   @original_score ||= @query.all_original.where(:author_id => @author.id).count
  # end

  # def remixed_score
  #   @remixed_score ||= @query.joins(:parent).where(:parent => {:}.count
  # end

  # def post_sum
  #   original_score + remixed_score
  # end

  def post_count
    @query.where(:author_id => @author_id).count
  end

  def likes_count # avg score of your liked post
    @query.where(:author_id => @author_id).sum(:likes_count)
  end
end