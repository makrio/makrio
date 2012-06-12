class AddFeaturedToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :featured, :boolean, :default => false, :null => false
    ActiveRecord::Base.connection.execute("UPDATE posts set featured = true;")
  end
end
