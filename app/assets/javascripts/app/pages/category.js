app.pages.Category = app.views.Base.extend({
  templateName : "catagory-page",

  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView"
  },

  initialize : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      subdomain : window.location.subdomain()
    })
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
    this.headerView = new app.views.Header({model : this.stream})
  }
});
