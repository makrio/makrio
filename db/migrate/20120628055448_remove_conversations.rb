class RemoveConversations < ActiveRecord::Migration
  def up
    drop_table :conversation_visibilities
    drop_table :messages
    drop_table :conversations
  end

  def down
    create_table "conversation_visibilities", :force => true do |t|
      t.integer  "conversation_id",                :null => false
      t.integer  "person_id",                      :null => false
      t.integer  "unread",          :default => 0, :null => false
      t.datetime "created_at",                     :null => false
      t.datetime "updated_at",                     :null => false
    end

    add_index "conversation_visibilities", ["conversation_id", "person_id"], :name => "index_conversation_visibilities_usefully", :unique => true
    add_index "conversation_visibilities", ["conversation_id"], :name => "index_conversation_visibilities_on_conversation_id"
    add_index "conversation_visibilities", ["person_id"], :name => "index_conversation_visibilities_on_person_id"

    create_table "conversations", :force => true do |t|
      t.string   "subject"
      t.string   "guid",       :null => false
      t.integer  "author_id",  :null => false
      t.datetime "created_at", :null => false
      t.datetime "updated_at", :null => false
    end


    create_table "messages", :force => true do |t|
      t.integer  "conversation_id",         :null => false
      t.integer  "author_id",               :null => false
      t.string   "guid",                    :null => false
      t.text     "text",                    :null => false
      t.datetime "created_at",              :null => false
      t.datetime "updated_at",              :null => false
      t.text     "author_signature"
      t.text     "parent_author_signature"
    end

    add_index "messages", ["author_id"], :name => "index_messages_on_author_id"
  end
end
