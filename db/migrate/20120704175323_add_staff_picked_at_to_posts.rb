class AddStaffPickedAtToPosts < ActiveRecord::Migration
  def change
    add_column :posts, :staff_picked_at, :datetime
  end
end
