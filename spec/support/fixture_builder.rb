require File.join(File.dirname(__FILE__), "user_methods.rb")

FixtureBuilder.configure do |fbuilder|

  # rebuild fixtures automatically when these files change:
  fbuilder.files_to_check += Dir["app/models/*.rb", "lib/**/*.rb",  "spec/factories/*.rb", "spec/support/fixture_builder.rb"]

  # now declare objects
  fbuilder.factory do
    # Users
    Factory(:user, :username => "alice")
    Factory(:user, :username => "eve")
    Factory(:user, :username => "bob")

    # Set up friends - 2 local, 1 remote
    Factory(:user, :username => "luke")
    Factory(:user, :username => "leia")
    Factory(:person, :diaspora_handle => "raphael@remote.net")
   end
end