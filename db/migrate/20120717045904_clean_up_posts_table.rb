class CleanUpPostsTable < ActiveRecord::Migration
  def up
    remove_columns(:posts, :status_message_guid, :reshares_count,:objectId ,:remote_photo_path,:remote_photo_name,:random_string,:actor_url)

    if index_exists?(:posts, :name => "index_posts_on_status_message_guid")
      remove_index! :posts, :name => "index_posts_on_status_message_guid"
    end
    if index_exists?(:posts, :name => "index_posts_on_status_message_guid_and_pending")
      remove_index! :posts, :name => "index_posts_on_status_message_guid_and_pending"
    end
  end

  def down
    change_table(:posts, :bulk => true) do |t|
      t.string   "actor_url"
      t.string   "objectId"
      t.text     "remote_photo_path"
      t.string   "remote_photo_name"
      t.string   "random_string"
      t.string   :status_message_guid
      t.integer  "reshares_count",          :default => 0
    end

    add_index "posts", ["status_message_guid", "pending"], :name => "index_posts_on_status_message_guid_and_pending"
    add_index "posts", ["status_message_guid"], :name => "index_posts_on_status_message_guid"
  end
end
