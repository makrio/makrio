class AddCounterCacheToPerson < ActiveRecord::Migration
  def change
    add_column :people, :followers_count, :integer, :default => 0
    add_column :people, :followed_count, :integer, :default => 0
  end
end
