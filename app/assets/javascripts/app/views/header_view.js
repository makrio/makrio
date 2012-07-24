app.views.Header = app.views.Base.extend({
  templateName : "header",
  id: "header",

  events : {
    "click .bookmarklet-button" : "bookmarkletInstructionsPrompt",
    "click a.notification" : "readNotificationAndNavigate",
    "click #composer-button" : 'showModalFramer'
  },

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      notifications : this.notifications(),
      bookmarkletJS : this.bookmarkletJS(),
      onLatest : function() { return document.location.pathname.search("stream") !== -1},
      onPopular : function() { return document.location.pathname.search("popular") !== -1 },
      onLikes : function() { return document.location.pathname.search("likes") !== -1 },
      onStaffPicks: function() { return document.location.pathname.search("staff") !== -1 },
      onTimeWarp: function() { return document.location.pathname.search("timewarp") !== -1 },
      onTopics: function() { return document.location.pathname.search("top_tags") !== -1 }
    })
  },

  postRenderTemplate : function() {
    this.$('.dropdown-toggle').dropdown()
    this.$('.bookmarklet, .nav-tab li, .navbar-inner button').tooltip({placement: 'bottom', delay: { show: 500, hide: 100 }});
  },

  bookmarkletInstructionsPrompt : function(evt) {
    evt.preventDefault()
    alert("Drag me to the bookmarks bar to post to makr.io from anywhere on the web")
  },

  notifications : function() {
    return window.preloads && window.preloads.notifications
  },

  readNotificationAndNavigate : function(evt) {
    evt && evt.preventDefault()
    var link = $(evt.target).closest("a")
      , href = link.attr("href")
      , notificationId = link.data("notification-id")

    // mark the thing as read with this ghetto legacy endpoint
    $.ajax({
      url : "/notifications/" + notificationId,
      type : "PUT"
    })

    app.setLocation(href)
  }
});
