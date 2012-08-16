app.views.Header = app.views.Base.extend({
  templateName : "header",
  id: "header",

  events : {
    'click .composer-button' : 'showModalFramer',
    'click .login-link' : 'showModalLogin',
    'click .root-nav a' : 'navigateSub'
  },

  subviews : {
    "#sub_header" : 'subHeaderView'
  },

  initialize : function() {
    this.subHeaderView = new app.views.SubHeader();
    this.bindEvents()
  },

  bindEvents : function() {
    app.router.on("all", this.render, this)
    app.router.on("all", this.unsetRootNav, this)
  },

  unbind : function() {
    app.router.off("all", this.render, this)
    app.router.off("all", this.unsetRootNav, this)
  },

  unsetRootNav : function() {
    _.each(['onExplore', 'onYou'], function(key) {
      app[key] = undefined
    })
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onExplore: app.onExplore,
      onYou: app.onYou
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
    return app.onExplore || app.onYou
  },

  navigateSub : function(evt) {
    evt && evt.preventDefault()
    app.router.navigate($(evt.target).attr("href").substring(1) ,true)
  }
});

app.views.SubHeader = app.views.Base.extend({
  templateName: 'sub-header',

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
      onYou: app.onYou
    })
  },

  navigateSub : function(evt) {
    evt && evt.preventDefault()
    app.router.navigate($(evt.target).attr("href").substring(1) ,true)
  }
});
