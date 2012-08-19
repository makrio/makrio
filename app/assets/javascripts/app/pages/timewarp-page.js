app.pages.TimeWarp = app.pages.Base.extend({
  templateName : "time-warp-page",
  id : 'timewarp',
  
  subviews : {
    "#canvas" : "canvasView",
  },

  initialize : function(options){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
    app.onExplore = true
    this._daysAgo = options.daysAgo
  },

  presenter : function(){
    return {
      daysAgo : this.daysAgo()
    }
  },

  daysAgo : function() {
    return this._daysAgo && this._daysAgo.replace('days_ago=', '')
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
  },

  unbind : function() {
    this.canvasView.unbind()
  }
});
