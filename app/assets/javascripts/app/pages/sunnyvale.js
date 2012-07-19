app.pages.Sunnyvale = app.views.Base.extend({
  templateName : "sunnyvale",

  subviews : {
    "#canvas" : "canvasView",
    // "header" : "headerView"
  },

  initialize : function(options){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()

    this.title = options && options.title

    this.initSubviews()
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
    // this.headerView = new app.views.Header({model : this.stream})

  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      title : this.titleize(this.title)
    })
  },

  titleize : function(string) {
    if(!string) { return }
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase()
  }
});
