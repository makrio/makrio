app.pages.PostViewer = app.views.Base.extend({
  templateName: "post-viewer",

  subviews : {
    "#post-content" : "postView",
    "#post-nav" : "navView",
    "#post-interactions" : "interactionsView",
    "#author-info" : "authorView"
  },

  initialize : function(options) {
    this.model = new app.models.Post({ id : options.id });
    this.model.preloadOrFetch().done(_.bind(this.initViews, this));
    this.model.interactions.fetch() //async, yo, might want to throttle this later.

    this.bindEvents()
  },

  initViews : function() {
    /* init view */
    this.authorView = new app.views.PostViewerAuthor({ model : this.model });
    this.interactionsView = new app.views.PostViewerInteractions({ model : this.model });
    this.navView = new app.views.PostViewerNav({ model : this.model });
    this.postView = new app.views.Post.SmallFrame({
       model : this.model,
       className : "canvas-frame x2 height width"
    });

    this.render();
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

  closePane : function(evt) {
    if(evt.keyCode != 27) { return }
    this.interactionsView.hidePane();
  }
});
