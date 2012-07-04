app.views.Post.StreamFrame = app.views.Base.extend({
  className : "stream-frame",

  templateName : "stream-frame",

  subviews : {
    ".small-frame" : "smallFrameView"
  },

  events : {
    "click .toggle-featured" : "toggleFeatured",
    "click .toggle-staff-picked" : "toggleStaffPicked",
    "click a.remove-post" : "destroyModel"
  },


  tooltipSelector : ".post-author",

  initialize : function(options) {
    this.stream = options.stream
    this.smallFrameView = new app.views.Post.SmallFrame({ model : this.model })
    this.feedbackView = new app.views.StreamFeedbackActions({ model: this.model })
  },


  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      canRemove : this.canRemove()
    })
  },

  canRemove : function() {
    return this.model.get("author").guid == app.currentUser.get("guid")
  },


  toggleStaffPicked : function(evt){
    evt.preventDefault()
    if(confirm("u sure you want to staff pick?")){
      console.log(this.model)
      this.model.toggleStaffPicked()
      // this.render()
    }
  },
  
  toggleFeatured : function(evt){
    evt.preventDefault()
    if(confirm("u shore bro?")){
      this.model.toggleFeatured()
      this.remove()
    }
  }
});
