app.views.FollowButton = app.views.Base.extend({
  templateName : "follow-button",

  events : {
  	"click .follow-btn" : "follow"
  },

  initialize : function() {
  	this.relationship = this.model.relationship
  	this.bindEvents()
  },

  presenter : function() {
  	return _.extend(this.defaultPresenter(), {
  		isFollowing : this.relationship.id
  	})
  },

  bindEvents : function() {
  	this.relationship.on("change", this.render, this)
  },

  unbind : function() {
  	this.relationship.off("change", this.render)
  },

  follow : function() {
  	this.relationship.toggleFollow()
  }
});