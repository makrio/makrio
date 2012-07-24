app.pages.Stream = app.views.Base.extend({
  templateName : "stream",

  events : {
    "click .post-notifier" : "loadNewPosts"
  },

  subviews : {
    "header" : "headerView",
    "#stream-content" : "streamView",
  },

  initialize : function(){
    var page = window.location.pathname
    var poll = page.search(/^\/stream/) != -1 && window.location.search.search('days_ago') == -1
    this.stream = this.model = new app.models.Stream([], {poller: poll})
    this.stream.preloadOrFetch()

    this.initSubviews()
    this.bindEvents()
    this._pageTitle = document.title
  },

  setUpMousetrap : function(){
    var $window = $(window)

    Mousetrap.bind('j', function() { 
      $window.scroll()
      var frame = $('.selected-frame').parent().next()
      $window.scrollTop(frame.offset().top - 60)
    });

    Mousetrap.bind('k', function(){
      $window.scroll()
      var frame = $('.selected-frame').parent().prev() 
      $window.scrollTop(frame.offset().top - 60)
    })

    Mousetrap.bind('l', function(){
      $window.scroll()
       $('.selected-frame').find('.like').click()
    })

    Mousetrap.bind('r', function(){
      $window.scroll()
      $('.selected-frame').find('.remix').click()
    }) 

    Mousetrap.bind('c', function(e){
      $window.scroll()
      e.preventDefault()
      $(this).blur()
      $('textarea#new-comment-text').focus()
    })
  },

  initSubviews : function(){
    this.headerView = new app.views.Header({model : this.stream})
    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
  },

  bindEvents : function(){
    this.stream.on("hasMoar", this.notifyUserOfMorePosts, this)
    this.setUpMousetrap()
  },

  unbind : function(){
    this.stream.unbind()
    this.stream.off("hasMoar", this.notifyUserNewPosts, this)
    $(window).off("scroll")
  },

  loadNewPosts : function(){
    this.stream.trigger("loadNew")
    this.notificationDiv.remove()
    delete this.notificationDiv

    document.title = this._pageTitle;

    $(window).trigger("scroll").scrollTop(0)
  },

  notifyUserOfMorePosts : function(){
    this.notificationDiv = this.notificationDiv || createDiv()
    var count = this.stream.poller.models.length
      , noun = count == 1 ? "Post" : "Posts";

    this.notificationDiv.text(count + " New " + noun)
    document.title = "(" + count + ") " + this._pageTitle

    function createDiv(){
      var div = $("<div/>", {class : "post-notifier" })
      this.$("#stream-content").prepend(div)
      return div
    }
  }
},

//static methods
{
  InfiniteScrollView : app.views.InfScroll.extend({
    initialize: function(){
      this.stream = this.model
      this.collection = this.stream.items
      this.postClass = app.views.Post.StreamFrame
      this.setupInfiniteScroll()
    }
  })
});
