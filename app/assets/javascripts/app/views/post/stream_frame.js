app.views.Post.StreamFrame = app.views.Base.extend({
  className : "stream-frame",

  templateName : "stream-frame",

  subviews : {
    ".small-frame" : "smallFrameView",
    ".stream-frame-feedback" : "feedbackView"
  },

  tooltipSelector : ".post-author",

  initialize : function(options) {
    this.stream = options.stream
    this.smallFrameView = new app.views.Post.SmallFrame({model : this.model})
    this.feedbackView =  new app.views.FeedbackActions({ model: this.model })
  },

  events : {
    "click a.frame-link" : "goToPost",
    "click a.toggle-featured" : "toggleFeatured"
  },

  toggleFeatured : function(evt){
    evt.preventDefault()
    if(confirm("u shore bro?")){
      this.model.toggleFeatured()
      this.remove()
    }
  },

  goToPost : function(evt) {
    this.smallFrameView.goToPost(evt)
  }
});
