app.pages.GenericCanvas = app.pages.Base.extend({
  templateName : "generic-canvas-page",

  subviews : {
    "#canvas" : "canvasView",
    '#new_posts_notifier' : 'newPostsView'
  },

  initialize : function(opts){
    if(opts)
      _.extend(this, {
        pageTitle: opts.title,
        pageDescription: opts.description
      });

    this.setUpInfiniteScroll() 
  },

  presenter : function() {
    return(_.extend(this.defaultPresenter(), {
      title: this.pageTitle,
      description: this.pageDescription,
      mintedAndOnStaffPicks: app.onStaffPicks() && app.currentUser.minted()
    }))
  },

  setUpInfiniteScroll : function(options){
    //really gross. the old default here was to zero out sort order. pass in empty hash for the normal stream default behavior
    options = options || { collectionOptions: {} }
    this.stream = new app.models.Stream([], options)
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  initSubviews : function(){
    this.canvasView = new app.views.Canvas({model : this.stream})

    if(this.stream.poller){
      this.newPostsView = new app.views.NewPostNotifier({model : this.stream, page: this})
    }
  }
});

