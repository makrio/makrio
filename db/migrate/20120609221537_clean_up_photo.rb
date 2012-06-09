class CleanUpPhoto < ActiveRecord::Migration
  def up
    change_table :photos, :bulk => true do |p|
      p.remove :tmp_old_id
      p.remove :status_message_guid
      p.remove :comments_count
      p.remove :pending
    end
  end

  def down
    change_table :photos, :bulk => true do |p|
      p.integer :tmp_old_id
      p.string :status_message_guid
      p.integer :comments_count
      p.boolean :pending
    end
  end
end
