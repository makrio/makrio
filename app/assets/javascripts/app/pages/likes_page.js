app.pages.Likes = app.views.Base.extend({
  templateName : "likes-page",

  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView",
  },

  initialize : function(){
    this.stream = this.model = new app.models.Stream()
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
    this.headerView = new app.views.Header({model : this.stream})
  },
})
