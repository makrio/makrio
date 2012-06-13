class AddScreenshotToPost < ActiveRecord::Migration
  def change
    add_column(:posts, :screenshot, :string)
  end
end
