class RelationshipsController < ApplicationController
	before_filter :authenticate_user!

	respond_to :json

	def create
		respond_with current_user.person.follow!(params[:followed_id])
	end

	def destroy
		respond_with current_user.person.unfollow!(params[:id])
	end
end