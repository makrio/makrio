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

  initialize : function() {
    this.initViews()
    this.bindEvents()
  },

  initViews : function() {
    this.rootHeaderView = new app.views.RootHeader();
    this.subHeaderView = new app.views.SubHeader();
    this.signUpBannerView = new app.views.SignUpBanner();
  },

  bindEvents : function() {
    app.router.on("all", this.rootHeaderView.render, this)
    app.router.on("all", this.subHeaderView.render, this)
    app.router.on("all", this.unsetRootNav, this)
  },

  unbind : function() {
    app.router.off("all", this.rootHeaderView.render, this)
    app.router.off("all", this.subHeaderView.render, this)
    app.router.off("all", this.unsetRootNav, this)
  },

  unsetRootNav : function() {
    // hack for global state -- to be fixed
    _.each(['onExplore', 'onYou'], function(key) {
      app[key] = undefined
    })
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onFrontPage: function() { return window.location.pathname == '/' }
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
    return app.onExplore || app.onYou || window.location.pathname == "/" + app.currentUser.get("username")
  }
});

/* top-level nav */
app.views.RootHeader = app.views.Base.extend({
  templateName: "header/root",
  tagName: 'ul',
  className: 'nav-center root-nav',

  events : {
    'click .root-nav a' : 'navigateSub'
  },

  initialize : function(options) {
    this.base = options && options.base
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onExplore: app.onExplore,
      onYou: app.onYou || window.location.pathname == "/" + app.currentUser.get("username"),
    })
  },

  navigateSub : function(evt) {
    evt && evt.preventDefault()
    app.router.navigate($(evt.target).attr("href").substring(1) ,true)
  }
});

/* sub-nav */
app.views.SubHeader = app.views.Base.extend({
  templateName: 'header/sub',

  events : {
    'click .sub-nav a' : 'navigateSub'
  },

  presenter : function() {
    var path = document.location.pathname
    return _.extend(this.defaultPresenter(), {
      onLatest : function() { return path.search("latest") !== -1},
      onFrontPage : function() { return path.search("front_page") !== -1 },
      onPopular : function() { return path.search("popular") !== -1 },
      onTimeWarp: function() { return path.search("timewarp") !== -1 },
      onTopics: function() { return path.search(/top_tags|topics$/) !== -1 },
      onInterests: function() { return path.search("interests") !== -1 },
      onLikes: function() { return path.search("likes") !== -1 },
      onPosts: function() { return path.search(app.currentUser.get("username")) !== -1 },

      onExplore: app.onExplore,
      onYou: app.onYou || window.location.pathname == "/" + app.currentUser.get("username")
    })
  },

  navigateSub : function(evt) {
    evt && evt.preventDefault()
    app.router.navigate($(evt.target).attr("href").substring(1) ,true)
  }
});
