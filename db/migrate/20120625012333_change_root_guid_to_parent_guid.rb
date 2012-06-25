class ChangeRootGuidToParentGuid < ActiveRecord::Migration
  def up
    rename_column :posts, :root_guid, :parent_guid
    rename_index :posts, "index_posts_on_root_guid", "index_posts_on_parent_guid"
  end

  def down
    rename_column :posts, :parent_guid, :root_guid
    rename_index :posts, "index_posts_on_parent_guid", "index_posts_on_root_guid"
  end
end
