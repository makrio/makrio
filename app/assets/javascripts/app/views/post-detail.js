app.views.PostDetail = app.views.Base.extend({
  templateName : 'post-detail',

  subviews : {
    "#featured_frame" : "postView",
    "#share-actions" : "shareView",
    "#viewer-feedback" : "feedbackView",
    "#viewer_reactions" : 'reactionsView',
    "#viewer_new_comment" : 'newCommentView',
  },

  events : {
    "click .toggle-featured" : "toggleFeatured",
    "click .toggle-staff-picked" : "toggleStaffPicked",
  },

  initialize : function(options) {
    this.model = options.model
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
    this.reactionsView = new app.views.PostViewerReactions({ model: this.model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : this.model })
  },

  shareView : function() {
    return new app.views.ShareView({model : this.model})
  },

  toggleStaffPicked : function(evt){
    evt && evt.preventDefault()
    this.feedbackView.toggleStaffPicked()
  },
  
  toggleFeatured : function(evt){
    evt && evt.preventDefault()
    if(confirm("u shore bro?")){
      this.model.toggleFeatured()
    }
  }



});