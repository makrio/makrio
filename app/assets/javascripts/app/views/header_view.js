app.views.Header = app.views.Base.extend({
  templateName : "header",
  id: "header",

  events : {
    'click .composer-button' : 'showModalFramer',
    'click .login-link' : 'showModalLogin'
  },

  postRenderTemplate : function() {
    this.$('.nav-main li, .nav-about li').tooltip({placement: 'bottom', delay: { show: 300, hide: 100 }});
  },

  presenter : function(){
    var path = document.location.pathname

    return _.extend(this.defaultPresenter(), {
      onLatest : function() { return path.search("latest") !== -1},
      onFrontPage : function() { return path.search("front_page") !== -1 || path == "/"},
      onPopular : function() { return path.search("popular") !== -1 },
      onStaffPicks: function() { return path.search("staff") !== -1 },
      onTimeWarp: function() { return path.search("timewarp") !== -1 },
      onTopics: function() { return path.search(/top_tags|topics$/) !== -1 },
      onInterests: function() { return path.search("interests") !== -1 },
      onLikes: function() { return path.search("likes") !== -1 },
      onPosts: function() { return path.search(currentUser.get("username")) !== -1 },

      // temp router hack
      onExplore: app.onExplore,
      onYou: app.onYou,
      showSubNav: this.showSubNav()
    })
  },

  showSubNav : function() {
    return app.onExplore || app.onYou
  }
});
