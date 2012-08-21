app.views.FollowButton = app.views.Base.extend({
  templateName : "follow-button",
  tagName: "span",

  events : {
  	"click .follow-btn" : "follow"
  },

  initialize : function() {
  	this.relationship = this.model.relationship
  	this.bindEvents()
  },

  postRenderTemplate : function() {
    if(app.currentUser.id == this.model.id)
      this.$el.css("display", "none");
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

    /* update the collection */
    if(this.collection) this.updateCollection();
  },

  updateCollection : function() {
    _.each(this.collection.models, _.bind(function(model){
      if(model.get("author").id == this.model.id)
        model.get("author").relationship = this.relationship
    }, this))
  }
});