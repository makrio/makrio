app.pages.ConversationsIndex = app.views.Base.extend({
  templateName : "generic-canvas-page",
  id : "cnv_index",

  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView"
  },

  initialize : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
    this.headerView = new app.views.Header({model : this.stream})

    this.canvasView.postClass = app.views.Post.ConversationFrame
  }
});
