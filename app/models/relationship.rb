class Relationship < ActiveRecord::Base
  attr_accessible :followed_id

  belongs_to :follower, class_name: "Person"
  belongs_to :followed, class_name: "Person"

  validates :follower_id, presence: true
  validates :followed_id, presence: true

  def as_json(opts={})
  	{
  		id: self.id,
  		followed_id: self.followed_id,
  		follower_id: self.follower_id
  	}
  end
end
