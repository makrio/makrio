module Jobs
  class ResetPassword < Base
    @queue = :mail

    def perform(user_id)
      user = User.find(user_id)
      ::Devise.mailer.reset_password_instructions(user).deliver
    end
  end
end
