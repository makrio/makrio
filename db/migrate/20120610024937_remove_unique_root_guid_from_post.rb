class RemoveUniqueRootGuidFromPost < ActiveRecord::Migration
  def up
    remove_index(:posts, :name =>  "index_posts_on_author_id_and_root_guid")
  end

  def down
    add_index(:posts, [:author_id, :root_guid])
  end
end
