namespace :emails do
  task :new_inactive_user_prod do
    require Rails.root.join('config/environment')
    require Rails.root.join('app/mailers/notifier')

    users = User.where('created_at > ?', 3.days.ago).where('created_at < ?', 2.days.ago).find_all do |user|
      user.posts.count == 0
    end

    users.each{|user| puts "emailing #{user.username}";Notifier.new_inactive_user_prod(user).deliver!}
  end

  task :new_user_feedback do
    require Rails.root.join('config/environment')
    require Rails.root.join('app/mailers/notifier')
    
    users = User.where('created_at > ?', 1.days.ago).all
    users.each{|user| puts "emailing #{user.username}"; Notifier.new_user_feedback(user).deliver!}
  end
end