class RenameImageFieldsOnPost < ActiveRecord::Migration
  def up
    rename_column :posts, :image_height, :screenshot_height
    rename_column :posts, :image_width, :screenshot_width
  end

  def down
    rename_column :posts, :screenshot_width, :image_width
    rename_column :posts, :screenshot_height, :image_height
  end
end
