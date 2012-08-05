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
    return _.extend(this.defaultPresenter(), {
      onLatest : function() { return document.location.pathname.search("latest") !== -1},
      onFrontPage : function() { return document.location.pathname.search("front_page") !== -1},
      onPopular : function() { return document.location.pathname.search("popular") !== -1 },
      onStaffPicks: function() { return document.location.pathname.search("staff") !== -1 },
      onTimeWarp: function() { return document.location.pathname.search("timewarp") !== -1 },
      onTopics: function() { return document.location.pathname.search(/top_tags|topics/) !== -1 },
      onInterests: function() { return document.location.pathname.search("interests") !== -1 },
      onLikes: function() { return document.location.pathname.search("likes") !== -1 },
      onPosts: function() { return document.location.pathname.search(currentUser.get("username")) !== -1 },

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
