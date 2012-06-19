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
      bookmarkletJS : this.bookmarkletJS()
    })
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
  }, 500),

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
    return "javascript:(function(){f='" + document.location.origin + "/framer?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title)+'&notes='+encodeURIComponent(''+(window.getSelection?window.getSelection():document.getSelection?document.getSelection():document.selection.createRange().text))+'&v=1&';a=function(){if(!window.open(f+'noui=1&jump=doclose','diasporav1','menubar=no,location=no,links=no,scrollbars=no,toolbar=no,width=980,height=520'))location.href=f+'jump=yes'};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})()"
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
      if(post.showInFeaturedStream()){
        return app.views.InfScroll.prototype.createPostView.call(this, post)
      } else {
        return new Backbone.View //stub it out if its not featured or yours
      }
    }
  })
});
