class AddTemporaryUrlToPhotos < ActiveRecord::Migration
  def change
    add_column :photos, :temporary_url, :string
  end
end
