app.views.PostDetail = app.views.Base.extend({
  templateName : 'post-detail',

  subviews : {
    "#featured_frame" : "postView",
    "#share-actions" : "shareView",
    "#viewer-feedback" : "feedbackView",

  },


  initialize : function(options) {
    this.model = options.model
    console.log(this.model)
    this.model.interactions.fetch()
    this.initViews()
  },

  initViews : function() {
    this.feedbackView = new app.views.ViewerFeedbackActions({model : this.model})

    this.postView = new app.views.Post.SmallFrame({
       model : this.model,
       className : "canvas-frame",
       composing : true
    });
  },

  shareView : function() {
    return new app.views.ShareView({model : this.model})
  },
});