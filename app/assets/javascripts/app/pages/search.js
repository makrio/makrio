app.pages.Search = app.pages.GenericCanvas.extend({
  templateName : "generic-canvas-page",

  initialize : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  }
});
