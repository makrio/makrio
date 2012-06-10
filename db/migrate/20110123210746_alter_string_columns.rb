class AlterStringColumns < ActiveRecord::Migration
    # This alters the tables to avoid a mysql bug
    # See http://bugs.joindiaspora.com/issues/835
    def self.up
        remove_index :profiles, :column => [:first_name, :searchable]
        remove_index :profiles, :column => [:last_name, :searchable]
        remove_index :profiles, :column => [:first_name, :last_name, :searchable]
        change_column(:profiles, :first_name, :string, :limit => 127)
        change_column(:profiles, :last_name, :string, :limit => 127)
        add_index :profiles, [:first_name, :searchable]
        add_index :profiles, [:last_name, :searchable]
        add_index :profiles, [:first_name, :last_name, :searchable]
    end
end
