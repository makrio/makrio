class PhotoPosting < ActiveRecord::Base
  belongs_to :photo
  belongs_to :post
end

class Post < ActiveRecord::Base
  has_many :photos, :through => :photo_postings
  def self.xml_name(crap)
  end
  def self.xml_attr(crap)
  end
end

class Post < ActiveRecord::Base
end

class StatusMessage < Post    
end

class Photo < ActiveRecord::Base
  belongs_to :status_message, :foreign_key => :status_message_guid, :primary_key => :guid
  has_many :posts, :through => :photo_postings
end

class CreatePhotoPostingsFromExistingPosts < ActiveRecord::Migration
  def up
    Photo.all.each do |p|
      if p.status_message.present?
        pp = PhotoPosting.new
        pp.post_id = p.status_message.id
        pp.photo_id = p.id
        pp.save
      else
        p.delete
      end
    end
  end

  def down
  end
end
