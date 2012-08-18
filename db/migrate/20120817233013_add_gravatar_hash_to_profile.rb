class AddGravatarHashToProfile < ActiveRecord::Migration
  def change
    add_column :profiles, :gravatar_hash, :string
  end
end
