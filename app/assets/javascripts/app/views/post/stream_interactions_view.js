app.views.StreamInteractions = app.views.Base.extend({
  id : "post-info",
  className: "span5",

  subviews:{
    ".comments" : "comments",
    ".new-comment" : "newCommentView",
    "#share-actions" : "shareView",
    "#follow-btn-container": "followButtonView"
  },

  templateName : "stream-interactions",

  initViews : function() {
    var author = new app.models.Profile(this.model.get("author"))
    this.followButtonView = new app.views.FollowButton({
      model : author,
      collection: app.page.stream.items
    })
  },

  setInteractions : function (model) {
    var self = this;
    this.model = model

    this.initViews()
    this.cleanupOldviews()

    this.comments = new app.views.PostViewerReactions({ model: model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : model })
    this.shareView = new app.views.ShareView({ model : model })

    _.defer(_.bind(this.render, this))
    _.delay(function(){
        var modelStillSelected = model.id && $(".stream-frame .active").data("id") == model.id
        if(modelStillSelected){
          model.interactions.fetch().done(function(){
            self.render()
          });
        }
      }, 1000
    )
  },

  cleanupOldviews : function(){
    this.comments && this.comments.unbind()
  }
});
