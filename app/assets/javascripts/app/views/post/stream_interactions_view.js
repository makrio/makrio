app.views.StreamInteractions = app.views.Base.extend({
  id : "post-info",

  subviews:{
    ".comments" : "comments",
    ".new-comment" : "newCommentView",
    "#share-actions" : "shareView"
  },

  templateName : "stream-interactions",

  setInteractions : function (model) {
    var self = this;
    this.model = model

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

  presenter : function(){
    var tags = this.model &&  this.model.get("tag_list")

    return _.extend(this.defaultPresenter(), {
      tags : tags
    })
  },

  cleanupOldviews : function(){
    this.comments && this.comments.unbind()
  }
});
