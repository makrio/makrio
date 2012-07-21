app.pages.GenericCanvas = app.views.Base.extend({
  templateName : "generic-canvas-page",

  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView"
  },

  initialize : function(){
    this.setUpInfiniteScroll() 
  },

  setUpInfiniteScroll : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
    this.headerView = new app.views.Header({model : this.stream})
  }
});

