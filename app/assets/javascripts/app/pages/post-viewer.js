app.pages.PostViewer = app.views.Base.extend({
  templateName: "post-viewer",

  subviews : {
    "#featured_frame" : "postView",
    "#post-nav" : "navView",
    "#share-actions" : "shareView",
    'header' : 'headerView',
    "#viewer-feedback" : "feedbackView",
    "#canvas" : "canvasView"
  },

  tooltipSelector : ".post-author",

  initialize : function(options) {
    this.model = new app.models.Post({ id : options.id });
    this.model.preloadOrFetch().done(_.bind(this.initViews, this));
    this.model.interactions.fetch()

    this.bindEvents()
  },

  initViews : function() {
    /* init view */
    this.navView = new app.views.PostViewerNav({ model : this.model });
    this.feedbackView = new app.views.ViewerFeedbackActions({model : this.model})

    this.postView = new app.views.Post.SmallFrame({
       model : this.model,
       className : "canvas-frame"
    });

    this.initializeStream()
    this.headerView = new app.views.Header({})
    this.render();
  },

  shareView : function() {
    return new app.views.ShareView({model : this.model})
  },

  bindEvents : function(){
    this.prepIdleHooks();
    this.bindNavHooks();

    $(document).bind("keyup", _.bind(this.closePane, this))
  },

  unbind : function(){
    $(document).unbind("idle.idleTimer")
    $(document).unbind("active.idleTimer")
    $(document).unbind('keydown')
    $(document).unbind('keyup')
  },

  prepIdleHooks : function () {
    $.idleTimer(3000);

    $(document).bind("idle.idleTimer", function(){
      $("body").addClass('idle');
    });

    $(document).bind("active.idleTimer", function(){
      $("body").removeClass('idle');
    });
  },

  bindNavHooks : function() {
    var model = this.model;
    $(document).keydown(function(evt){
      // prevent nav from happening if the user is using the arrow keys to navigate through their comment text
      if($(evt.target).is("textarea")) { return }

      switch(evt.keyCode) {
        case 37:
          app.router.navigate(model.get("next_post"), true); break;
        case 39:
          app.router.navigate(model.get("previous_post"), true); break;
        default:
          break;
      }
    })
  },

  postRenderTemplate : function() {
    if(this.model.get("title")){ document.title = $.trim(this.model.get("title").replace(/<br>/g, ' ')); }
  },

  initializeStream : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    var conversation_id = this.model.get('conversation_id')


    this.stream.basePath = function(){ return "/conversations/" + conversation_id}
    

    this.stream.preloadOrFetch()

    this.canvasView = new app.views.Canvas({model : this.stream})

  },

  closePane : function(evt) {
    if(evt.keyCode != 27) { return }
    this.interactionsView.hidePane();
  }
});
