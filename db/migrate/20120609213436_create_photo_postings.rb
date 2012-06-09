class CreatePhotoPostings < ActiveRecord::Migration
  def up
    create_table :photo_postings do |t|
      t.integer :post_id
      t.integer :photo_id
    end
  end

  def down
    drop_table :photo_postings
  end
end
