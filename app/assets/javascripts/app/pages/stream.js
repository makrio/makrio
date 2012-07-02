app.pages.Stream = app.views.Base.extend({
  templateName : "stream",

  events : {
    "click .bookmarklet-button" : "bookmarkletInstructionsPrompt",
    "activate .stream-frame-wrapper" : 'triggerInteractionLoad',
    "click a.notification" : "readNotificationAndNavigate",
    "click .post-notifier" : "loadNewPosts",
    "click *[data-remix-id]" : 'showModalFramer'
  },

  subviews : {
    "#stream-content" : "streamView",
    "#stream-interactions" : "interactionsView"
  },

  initialize : function(){
    this.stream = this.model = new app.models.Stream()
    this.stream.preloadOrFetch()

    this._pageTitle = document.title

    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
    this.interactionsView = new app.views.StreamInteractions()
    _.bindAll(this.showModalFramer)
    this.bindEvents()
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
//    $("body").data("scrollspy", undefined) //this is for the stream scroller when we navigate to not bind millions of times i love you when we don't page navigate :)
  },

  loadNewPosts : function(){
    this.stream.trigger("loadNew")
    this.notificationDiv.remove()
    delete this.notificationDiv

    document.title = this._pageTitle;

    this.resetScrollSpy()
    $(window).trigger("scroll").scrollTop(0)
  },

  showModalFramer : function(evt){
    evt.preventDefault();
    var post_id = $(evt.target).data('remix-id')
    var post = (post_id =='new') ? undefined : this.stream.items.get(post_id).buildRemix()

    this.framer = new app.pages.InlineFramer({model : post})
    this.framer.show()
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
    this.$('.dropdown-toggle').dropdown()
    this.$('.bookmarklet').tooltip({placement: 'bottom'});
    if(app.currentUser.get("getting_started")) {
      this.showGettingStarted()
    }

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

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      notifications : this.notifications(),
      bookmarkletJS : this.bookmarkletJS(),
      onLatest : function() { return document.location.pathname.search("stream") !== -1},
      onPopular : function() { return document.location.pathname.search("popular") !== -1 },
      onHearts : function() { return document.location.pathname.search("hearts") !== -1 }
    })
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
  },

  bookmarkletJS : function() {
    return "javascript:void(function(){ if(window.location.host.match(/makr/)){alert('Drag the \"Remix\" button to your bookmarks bar to easily remix any photo while you browse the web!');return};\
    if(document.getElementsByTagName('head').length ==0){document.getElementsByTagName('html')[0].appendChild(document.createElement('head'))} \
    var head= document.getElementsByTagName('head')[0]; \
    var script= document.createElement('script'); \
    script.type= 'text/javascript'; \
    script.src= '" + document.location.origin +  "/bookmarklet.js'; \
    script.id= 'makrio-bm-script'; \
    script.setAttribute('data-origin','" + document.location.origin + "'); \
    head.appendChild(script);}());";
  },

  bookmarkletInstructionsPrompt : function(evt) {
    evt.preventDefault()
    alert("Drag me to the bookmarks bar to post to makr.io from anywhere on the web")
  },

  notifications : function() {
    return window.preloads && window.preloads.notifications
  },

  showGettingStarted : function() {
    var gettingStartedView = new app.views.GettingStarted()
    $("body").addClass('lock')
      .prepend(gettingStartedView.render().el)
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

    window.location = href
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
    },

    createPostView : function(post){
      return app.views.InfScroll.prototype.createPostView.call(this, post)
    }
  })
});
