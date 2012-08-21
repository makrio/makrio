/* base */
app.views.Header = app.views.Base.extend({
  templateName : "header/base",
  id: "header",

  events : {
    'click .composer-button' : 'showModalFramer',
    'click .login-link' : 'showModalLogin'
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
      onLogin : function() { return path.search("users") !== -1},
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
      onYou: app.page && app.page.options.you || window.location.pathname == "/" + app.currentUser.get("username"),
    })
  }
});

/* sub-nav */
app.views.SubHeader = app.views.Base.extend({
  templateName: 'header/sub',

  presenter : function() {
    var path = document.location.pathname
    return _.extend(this.defaultPresenter(), {
      onLatest : function() { return path.search("latest") !== -1},
      onFeed : function() { return path.search("feed") !== -1},
      onFrontPage : function() { return path.search("front_page") !== -1 },
      onPopular : function() { return path.search("popular") !== -1 },
      onTimeWarp: function() { return path.search("timewarp") !== -1 },
      onTopics: function() { return path.search(/top_tags|topics$/) !== -1 },
      onInterests: function() { return path.search("interests") !== -1 },
      onLikes: function() { return path.search("likes") !== -1 },
      onPosts: function() { return path.search(app.currentUser.get("username")) !== -1 },

      onExplore: app.page && app.page.options.explore,
      onYou: app.page && app.page.options.you || window.location.pathname == "/" + app.currentUser.get("username")
    })
  }
});