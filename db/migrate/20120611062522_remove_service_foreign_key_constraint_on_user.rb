class RemoveServiceForeignKeyConstraintOnUser < ActiveRecord::Migration
  def up
    remove_foreign_key :services, :column => :user_id
  end

  def down
    add_foreign_key :services, :column => :user_id
  end
end
