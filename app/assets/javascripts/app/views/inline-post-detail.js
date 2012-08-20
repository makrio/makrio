app.views.InlinePostDetail = app.views.Base.extend({
  templateName : 'inline-post-detail',
  className : 'inline-post-detail',
  subviews : {
  	"#selected_frame" : 'smallFrameView',
  	"#selected_reactions" : 'reactionsView',
  	"#selected_new_comment" : 'newCommentView',
  	"#share-actions" : 'shareView',
    "#follow-btn-container": "followButtonView"
  },

  initialize : function(){
  	this.initViews()
  },

  initViews : function() {
    this.reactionsView = new app.views.PostViewerReactions({ model: this.model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : this.model })
    this.shareView = new app.views.ShareView({ model : this.model })

    // follow button
    var author = new app.models.Profile(this.model.get("author"))
    this.followButtonView = new app.views.FollowButton({model : author})

    this.smallFrameView = new app.views.Post.SmallFrame({
    	model : this.model,
    	composing : true,
    	className : 'canvas-frame x2'
    })
  }
});
