app.pages.GenericCanvas = app.pages.Base.extend({
  templateName : "generic-canvas-page",

  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView",
    "#user_pane" : "userPaneView"
  },

  initialize : function(options){
    this.pageTitle = options && options.title
    this.pageDescription = options && options.description
    this.setUpInfiniteScroll() 
  },

  presenter : function() {
    return(_.extend(this.defaultPresenter(), {
      title : this.pageTitle,
      description : this.pageDescription
    }))
  },

  postRenderTemplate : function(){
    if(!app.currentUser.getting_started){
      this.showGettingStarted()
    }
  },

  showGettingStarted : function(){
    var gettingStartedView = new app.views.GettingStarted({})
    this.showModal(gettingStartedView)
  },

  setUpInfiniteScroll : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})
    this.headerView = new app.views.Header({model : this.stream})
    this.userPaneView = new app.views.UserPaneView()
  }
});

