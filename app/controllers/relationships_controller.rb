class RelationshipsController < ApplicationController
	before_filter :authenticate_user!

	respond_to :json

	def create
		follow = current_user.person.follow(params[:followed_id])
		follow.save
		Notifications::Followed.notify(current_user.person, params[:followed_id])
		respond_with follow 
	end

	def destroy
		respond_with current_user.person.unfollow!(params[:id])
	end

	def following
		index do |user|
			@people = user.person.followed_people
		end
	end

	def followers
		index do |user|
			@people = user.person.followers
		end
	end

	def index(&block)
		user = User.find_by_username(params[:username])
		yield user
		gon.person = PersonPresenter.new(user.person, current_user)
		gon.people = PersonPresenter.as_collection(@people, current_user)
		render :nothing => true, :layout => "post"
	end

	def follow_fb_friends
		service = current_user.services.find{|x| x.provider =='facebook'}
		Sidekiq::Client.enqueue(Jobs::BatchFollowFromService, service.id) if service.present?
		redirect_to :back, :notice => 'You will be following your Facebook friends shortly!'
	end
end