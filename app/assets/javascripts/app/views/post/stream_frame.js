app.views.Post.StreamFrame = app.views.Base.extend({
  className : "stream-frame",

  templateName : "stream-frame",

  subviews : {
    ".small-frame" : "smallFrameView",
    ".stream-frame-feedback" : "feedbackView"
  },

  initialize : function(options) {
    this.stream = options.stream
    this.smallFrameView = new app.views.Post.SmallFrame({model : this.model})
    this.feedbackView =  new app.views.FeedbackActions({ model: this.model })

    console.log(this.model.attributes)
  },

  events : {
    'click .content' : 'triggerInteracted',
    "click a.permalink" : "goToPost",
    "click a.toggle-featured" : "toggleFeatured"
  },

  triggerInteracted : function() {
    this.stream.trigger("frame:interacted", this.model)
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
