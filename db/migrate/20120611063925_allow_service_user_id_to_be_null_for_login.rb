class AllowServiceUserIdToBeNullForLogin < ActiveRecord::Migration
  def up
    change_column :services, :user_id, :integer, :null => true
  end

  def down
    change_column :services, :user_id, :null => false
  end
end
