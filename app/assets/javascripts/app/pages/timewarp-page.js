app.pages.TimeWarp = app.views.Base.extend({
  templateName : "time-warp-page",
  id : 'timewarp',
  
  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView",
    "#user_pane" : "userPaneView"
  },

  initialize : function(options){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
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
    this.headerView = new app.views.Header()
    this.userPaneView = new app.views.UserPaneView()
  }
});
