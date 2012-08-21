class Relationship < ActiveRecord::Base
  attr_accessible :followed_id

  belongs_to :follower, class_name: "Person", counter_cache: :followed_count  #followed person count
  belongs_to :followed, class_name: "Person", counter_cache: :followers_count #followers count

  validates :follower_id, presence: true
  validates :followed_id, presence: true
  validate :follower_is_is_not_followed_id

  def follower_is_is_not_followed_id
    if followed_id == follower_id
      errors[:base] << 'Can not follow yourself'
    end
  end

  def as_json(opts={})
  	{
  		id: self.id,
  		followed_id: self.followed_id,
  		follower_id: self.follower_id
  	}
  end
end
