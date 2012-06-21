namespace :emails do
  task :new_inactive_user_prod => :environment do
    Rails.application.eager_load!
    users = User.where('created_at > ?', 3.days.ago).where('created_at < ?', 2.days.ago).find_all do |user|
      user.posts.count == 0
    end

    users.each{|user| puts "emailing #{user.username}";Notifier.new_inactive_user_prod(user)}
  end

  task :new_user_feedback => :environment do
    Rails.application.eager_load!
    users = User.where('created_at > ?', 1.days.ago).all
    users.each{|user| puts "emailing #{user.username}"; Notifier.new_user_feedback(user)}
  end
end