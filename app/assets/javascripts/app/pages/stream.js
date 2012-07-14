app.pages.Stream = app.views.Base.extend({
  templateName : "stream",

  events : {
    "click .post-notifier" : "loadNewPosts",
    "activate .stream-frame-wrapper" : 'triggerInteractionLoad',
  },

  subviews : {
    "#stream-header" : "headerView",
    "#stream-content" : "streamView",
    "#stream-interactions" : "interactionsView",
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

  initSubviews : function(){
    this.headerView = new app.views.Header({model : this.stream})
    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
    this.interactionsView = new app.views.StreamInteractions()
  },

  bindEvents : function(){
    this.stream.on("hasMoar", this.notifyUserOfMorePosts, this)
    this.stream.on("fetched", this.resetScrollSpy, this)
    this.stream.on("frame:interacted", this.selectFrame, this)
    this.on("refreshScrollSpy", this.refreshScrollSpy, this)
  },

  unbind : function(){
    this.stream.unbind()
    this.stream.off("hasMoar", this.notifyUserNewPosts, this)
    this.stream.off("fetched", this.resetScrollSpy, this)
    this.stream.off("frame:interacted", this.selectFrame, this)
    this.off("refreshScrollSpy", this.refreshScrollSpy, this)

    $(window).unbind("scroll")
  },

  loadNewPosts : function(){
    this.stream.trigger("loadNew")
    this.notificationDiv.remove()
    delete this.notificationDiv

    document.title = this._pageTitle;

    this.resetScrollSpy()
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
