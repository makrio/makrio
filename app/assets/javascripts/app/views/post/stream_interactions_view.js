app.views.StreamInteractions = app.views.Base.extend({
  id : "post-info",

  subviews:{
    ".comments" : "comments",
    ".new-comment" : "newCommentView",
    ".love-message" : "loveView"
  },

  templateName : "stream-interactions",

  setInteractions : function (model) {
    model.interactions.fetch().done(
      _.bind(function () {
        this.render()
      }, this));

    this.comments = new app.views.PostViewerReactions({ model: model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : model })
    this.loveView = new app.views.LoveView({ model : model })
  }
});

app.views.LoveView = app.views.Base.extend({
  templateName: 'love',

  events : {
    "click .love-this" : "loveFrame"
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(),{
      userLike : this.model.interactions.userLike(),
    })
  },

  loveFrame : function(evt) {
    if(evt){evt.preventDefault()}
    this.model.interactions.toggleLike({'referrer' : 'give_love_button'})
  }
})
