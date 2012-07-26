app.views.InlinePostDetail = app.views.Base.extend({
  templateName : 'inline-post-detail',

  subviews : {
  	"#selected_frame" : 'smallFrameView',
  	"#selected_reactions" : 'reactionsView',
  	"#selected_new_comment" : 'newCommentView',
  	"#share-actions" : 'shareView'
  },

  initialize : function(){
  	this.initViews()
  },

  initViews : function() {
    this.reactionsView = new app.views.PostViewerReactions({ model: this.model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : this.model })
    this.shareView = new app.views.ShareView({ model : this.model })

    this.smallFrameView = new app.views.Post.SmallFrame({
    	model : this.model,
    	composing : true,
    	className : 'canvas-frame x2'
    })
  }
});
