class UpgradeDeviseToTwoPointOh < ActiveRecord::Migration
  def up
    add_column :users, :reset_password_sent_at, :datetime
    remove_index :users, :remember_token
    remove_column :users, :remember_token
  end

  def down
    remove_column :users, :reset_password_sent_at
    add_column :users, :remember_token, :string
    add_index :users, :remember_token, :unique => true
  end
end
