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
end