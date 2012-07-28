app.pages.PostViewer = app.pages.Base.extend({
  templateName: "post-viewer",

  subviews : {
    "#post-nav" : "navView",
    'header' : 'headerView',
    "#user_pane" : "userPaneView",
    "#canvas" : "canvasView",
    '#post-detail' : 'postDetailView'
  },

  tooltipSelector : ".post-author",

  initialize : function(options) {
    this.model = new app.models.Post({ id : options.id });
    this.model.preloadOrFetch().done(_.bind(this.initViews, this));

    this.bindEvents()
  },

  initViews : function() {
    /* init view */
    this.navView = new app.views.PostViewerNav({ model : this.model });
    this.postDetailView = new app.views.PostDetail({model : this.model})


    this.initializeStream()
    this.headerView = new app.views.Header()
    this.userPaneView = new app.views.UserPaneView()
    this.render();
  },


  bindEvents : function(){
    this.prepIdleHooks();
    this.bindNavHooks();
  },

  unbind : function(){
    $(document).off("idle.idleTimer")
    $(document).off("active.idleTimer")
    $(document).off('keydown')
    $(document).off('keyup')
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
});
