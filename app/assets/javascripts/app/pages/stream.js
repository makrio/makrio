app.pages.Stream = app.views.Base.extend({
  templateName : "stream",

  events : {
    "click .bookmarklet-button" : "bookmarkletInstructionsPrompt",
    "activate .stream-frame-wrapper" : 'triggerInteractionLoad',
    "click #composer-button" : 'compose'
  },

  subviews : {
    "#stream-content" : "streamView",
    "#stream-interactions" : "interactionsView"
  },

  initialize : function(){
    this.stream = this.model = new app.models.Stream()
    this.stream.preloadOrFetch()

    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
    this.interactionsView = new app.views.StreamInteractions()
    this.stream.on("fetched", function(){
      this._resetPeriod = 2000
      this.refreshScrollSpy()
    }, this)
    this.stream.on("frame:interacted", this.selectFrame, this)
    this.on("refreshScrollSpy", this.refreshScrollSpy, this)
  },

  postRenderTemplate : function() {
    this.$('.dropdown-toggle').dropdown()
    this.$('.bookmarklet').tooltip({placement: 'bottom'});
    if(app.currentUser.get("getting_started")) {
      this.showGettingStarted()
    }

    //after all of the child divs have been added, initialize the scroll spy
    _.defer(_.bind(function(){
      $('body').scrollspy({target : '.stream-frame-wrapper', offset : 115, streamElement : this.$("#stream")})
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
      bookmarkletJS : this.bookmarkletJS(),
      onLatest : function() { return document.location.pathname.search("stream") !== -1},
      onPopular : function() { return document.location.pathname.search("popular") !== -1 }
    })
  },

  unbind : function() {
    $(window).unbind("scroll")
  },

  compose : function() {
    app.router.navigate("/framer", {trigger : true})
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
    var self = this;
    this._resetPeriod = this._resetPeriod || 2000
    _.delay(function(){
      if(self._resetPeriod <= 10000) {
        $('body').scrollspy('refresh')
        self._resetPeriod = self._resetPeriod * 2
        self.trigger("refreshScrollSpy")
      }
    }, this._resetPeriod)
  },

  bookmarkletJS : function() {
    return "javascript:void(function(){ if(window.location.host.match(/makr/)){alert('Drag the \"Remix\" button to your bookmarks bar to easily remix any photo while you browse the web!');return};\
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

  showGettingStarted : function() {
    var gettingStartedView = new app.views.GettingStarted()
    $("body").addClass('lock')
      .prepend(gettingStartedView.render().el)
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
