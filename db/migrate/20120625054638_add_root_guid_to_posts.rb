class AddRootGuidToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :root_guid, :string
    add_index :posts, :root_guid
  end
end
