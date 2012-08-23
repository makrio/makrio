app.pages.Stream = app.pages.Base.extend({
  templateName : "stream",

  events : {
    "activate .stream-frame-wrapper" : 'triggerInteractionLoad',
  },

  subviews : {
    "#stream-content" : "streamView",
    "#stream-interactions" : "interactionsView",
    '#new_posts_zone' : 'newPostsView'
  },

  initialize : function(options){
    var page = window.location.pathname
      , poll = (page.search(/^\/latest/) != -1 || page.search(/^\/feed/) != -1 ) && window.location.search.search('days_ago') == -1

    this.stream = this.model = new app.models.Stream([], {poller: poll})
    this.stream.preloadOrFetch()
    this.onStream = options.onStream

    this.newPostsView = new app.views.NewPostNotifier({model : this.model, page: this})
    this.initSubviews()
    this.bindEvents()
  },

  setUpMousetrap : function(){
    var $window = $(window)

    Mousetrap.bind('j', function() { 
      $window.scroll()
      var frame = $('.selected-frame').parent().next()
      $window.scrollTop(frame.offset().top - 90)
    });

    Mousetrap.bind('n', function(){
      $('button#notifications-button').click()
    })

    Mousetrap.bind('k', function(){
      $window.scroll()
      var frame = $('.selected-frame').parent().prev() 
      $window.scrollTop(frame.offset().top - 90)
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
    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
    this.interactionsView = new app.views.StreamInteractions()
  },

  bindEvents : function(){
    this.stream.on("fetched", this.resetScrollSpy, this)
    this.on("refreshScrollSpy", this.refreshScrollSpy, this)
    this.setUpMousetrap()
  },

  unbind : function(){
    this.stream.unbind()
    this.newPostsView.unbind()

    this.stream.off("fetched", this.resetScrollSpy, this)
    this.off("refreshScrollSpy", this.refreshScrollSpy, this)

    this.streamView.unbind()
    this.interactionsView.unbind()
    this.newPostsView.unbind()

    $("body").removeData("scrollspy")
  },

  postRenderTemplate : function() {
    //after all of the child divs have been added, initialize the scroll spy
    _.defer(_.bind(function(){
      $('body').scrollspy({target : '.stream-frame-wrapper', offset : 150, streamElement : this.$("#stream")})
      this._resetPeriod = 500;
      this.refreshScrollSpy()

      //select frame needs a div to be in, so make sure this happens in a defer
      this.stream.deferred.done(_.bind(function(){
        var post = this.stream.items.models[0]
        this.selectFrame(post)
      }, this))
    }, this))
  },

  prependedPosts : function(){
    this.resetScrollSpy()
  },

  selectFrame : function(post){
    if(this.selectedPost == post) { return }
    this.selectedPost = post

    this.$(".stream-frame-wrapper").removeClass("selected-frame")
    this.$(".stream-frame-wrapper[data-id=" + this.selectedPost.id +"]").addClass("selected-frame")
    this.throttledInteractions(this.selectedPost)
  },

  throttledInteractions : _.throttle(function(post){
    this.interactionsView.setInteractions(post)
  }, 500), //so fast scrolling doesn't crash things

  triggerInteractionLoad : function(evt){
    this.selectFrame(this.stream.items.get($(evt.target).data("id")))
  },

  refreshScrollSpy : function(){
    this._resetPeriod = this._resetPeriod || 2000
    _.delay(_.bind(this.doRefresh, this), this._resetPeriod)
  },

  doRefresh : function(){
    if(this._resetPeriod <= 10000) {
      $('body').scrollspy('refresh')
      this._resetPeriod = this._resetPeriod * 2
      this.trigger("refreshScrollSpy")
    }
  },

  resetScrollSpy : function(){
    this._resetPeriod = 2000
    this.refreshScrollSpy()
    this.doRefresh()
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
