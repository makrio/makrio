/* base */
app.views.Header = app.views.Base.extend({
  templateName : "header/base",
  id: "header",

  events : {
    'click .composer-button' : 'showModalFramer',
    'click .login-link' : 'showModalLogin',
    'click .find-friends' : 'showModalFacebookFriendFinder'
  },

  subviews : {
    "#root_nav" : 'rootHeaderView',
    "#sub_header" : 'subHeaderView',
    "#sign_up_banner" : 'signUpBannerView'
  },

  initialize : function(options) {
    this.page = options && options.page

    this.initViews()
    this.bindEvents()
  },

  initViews : function() {
    this.rootHeaderView = new app.views.RootHeader()
    this.subHeaderView = new app.views.SubHeader()
    this.signUpBannerView = new app.views.SignUpBanner();

    this.facebookFriendFinderView = new app.views.FacebookFriendFinder()
  },

  bindEvents : function() {
    app.router.on("all", this.rootHeaderView.render, this)
    app.router.on("all", this.subHeaderView.render, this)
  },

  unbind : function() {
    app.router.off("all", this.rootHeaderView.render, this)
    app.router.off("all", this.subHeaderView.render, this)
  },

  presenter : function() {
    var path = window.location.pathname
    
    return _.extend(this.defaultPresenter(), {
      onFrontPage: function() { return path == '/' },
      onStream : app.page && app.page.onStream,
      onLogin : function() { return app.isOn("users")},
    })
  },

  postRenderTemplate : function() {
    this.$('.sub li').tooltip({placement: 'left', delay: { show: 300, hide: 100 }});

    // hiding and showing subnav
    if(this.showSubNav()) {
      this.subHeaderView.$el.css({"display":"block"})
    } else {
      this.subHeaderView.$el.css({"display":"none"})
    }
  },

  showSubNav : function() {
    return app.page && app.page.options.explore || app.page && app.page.options.you || window.location.pathname == "/" + app.currentUser.get("username")
  }
});

/* top-level nav */
app.views.RootHeader = app.views.Base.extend({
  templateName: "header/root",
  tagName: 'ul',
  className: 'nav-center root-nav',

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onExplore: app.page && app.page.options.explore,
      onYou: app.page && app.page.options.you || app.isOn("/" + app.currentUser.get("username")),
    })
  }
});

/* sub-nav */
app.views.SubHeader = app.views.Base.extend({
  templateName: 'header/sub',

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onLatest : function() { return app.isOn("latest")},
      onFeed : function() { return app.isOn("feed")},
      onFrontPage : function() { return app.isOn("front_page")},
      onPopular : function() { return app.isOn("popular")},
      onTimeWarp: function() { return app.isOn("timewarp") },
      onTopics: function() { return app.isOn(/top_tags|topics$/)},
      onInterests: function() { return app.isOn("interests")},
      onLikes: function() { return app.isOn("likes")},
      onPosts: function() { return app.isOn(app.currentUser.get("username")) },

      onExplore: app.page && app.page.options.explore,
      onYou: app.page && app.page.options.you || app.isOn("/" + app.currentUser.get("username"))
    })
  }
});