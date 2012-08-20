app.views.ProfileInfo = app.views.Base.extend({
  templateName : "profile-info",
  tooltipSelector : "*[rel=tooltip]",

  subviews : {
  	"#follow-btn-container": "followButtonView"
  },

  initialize : function(){
    this.model.on("change", this.render, this)
    this.initSubviews()
  },

  initSubviews : function() {
  	this.followButtonView = new app.views.FollowButton({model : this.model})
  },

  unbind : function() {
    this.followButtonView.unbind()
  }
});