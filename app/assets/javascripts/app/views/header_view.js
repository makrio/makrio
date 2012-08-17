app.views.Header = app.views.Base.extend({
  templateName : "header",
  id: "header",

  events : {
    'click .composer-button' : 'showModalFramer',
    'click .login-link' : 'showModalLogin'
  },

  initialize : function() {
    var pageOpts = arguments[0].page.options
    if(pageOpts)
      _.extend(this, {
        explore: pageOpts.explore,
        you: pageOpts.you
      })
  },

  postRenderTemplate : function() {
    this.$('.sub li').tooltip({placement: 'left', delay: { show: 300, hide: 100 }});
  },

  presenter : function(){
    var path = document.location.pathname

    return _.extend(this.defaultPresenter(), {
      onLatest : function() { return path.search("latest") !== -1},
      onFrontPage : function() { return path.search("front_page") !== -1 },
      onPopular : function() { return path.search("popular") !== -1 },
      onTimeWarp: function() { return path.search("timewarp") !== -1 },
      onTopics: function() { return path.search(/top_tags|topics$/) !== -1 },
      onInterests: function() { return path.search("interests") !== -1 },
      onLikes: function() { return path.search("likes") !== -1 },
      onPosts: function() { return path.search(currentUser.get("username")) !== -1 },

      onExplore: this.explore,
      onYou: this.you,
      showSubNav: this.showSubNav()
    })
  },

  showSubNav : function() {
    return this.explore || this.you
  }
});
