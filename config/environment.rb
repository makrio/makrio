#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

# check what database you have
def postgres?
  @using_postgres ||= defined?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter) && ActiveRecord::Base.connection.is_a?(ActiveRecord::ConnectionAdapters::PostgreSQLAdapter)
end

def sqlite?
  @using_sqlite ||= defined?(ActiveRecord::ConnectionAdapters::SQLite3Adapter) && ActiveRecord::Base.connection.class == ActiveRecord::ConnectionAdapters::SQLite3Adapter
end

# Load the rails application
require File.expand_path('../application', __FILE__)
Haml::Template.options[:format] = :html5
Haml::Template.options[:escape_html] = true

# Blacklist of usernames
USERNAME_BLACKLIST = ['admin', 'admin_panel', 'admin-panel', 'stream', 'staff_picks', 'likes', 'conversations', 'administrator', 'hostmaster', 'info', 'postmaster', 'root', 'ssladmin', 
  'ssladministrator', 'sslwebmaster', 'sysadmin', 'webmaster', 'support', 'contact', 'settings', 'account', 'help', 'signout', 'sign_out', 'sign_in', 'logout', 'login','posts', 
'threads', 'notifications', 'messages', 'resque-jobs', 'profile']

# Initialize the rails application
Diaspora::Application.initialize!
require File.join(Rails.root, 'lib/federation_logger')
