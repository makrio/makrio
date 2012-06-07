app.pages.Stream = app.views.Base.extend({
  templateName : "stream",

  events : {
    // 'activate .stream-frame-wrapper' : 'triggerInteractionLoad'
    "click .bookmarklet-button" : "bookmarkletInstructionsPrompt"
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

    this.streamView.on('loadMore', this.updateUrlState, this);
    // this.stream.on("fetched", this.refreshScrollSpy, this)
    this.stream.on("frame:interacted", this.selectFrame, this)
  },

  postRenderTemplate : function() {
    this.$("#header").css("background-image", "url(" + app.currentUser.get("wallpaper") + ")")
  },

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      bookmarkletJS : this.bookmarkletJS()
    })
  },

  selectFrame : function(post){
    if(this.selectedPost == post) { return }
    this.selectedPost = post
    
    this.$(".stream-frame-wrapper").removeClass("selected-frame")
    this.$(".stream-frame-wrapper[data-id=" + this.selectedPost.id +"]").addClass("selected-frame")
    this.interactionsView.setInteractions(this.selectedPost)
  },

  updateUrlState : function(){
    var post = this.stream.items.last();
    if(post){
      this.navigateToPost(post)
    }
  },

  navigateToPost : function(post){
    app.router.navigate(location.pathname + "?max_time=" + post.createdAt(), {replace: true})
  },

  triggerInteractionLoad : function(evt){
    this._throttledInteractions = this._throttledInteractions || _.bind(_.throttle(function(id){
      this.selectFrame(this.stream.items.get(id))
    }, 500), this)

    this._throttledInteractions($(evt.target).data("id"))
  },

  refreshScrollSpy : function(){
    this.$el.imagesLoaded(function(){
      // _.defer($('body').scrollspy('refresh'))
    })
  },

  bookmarkletJS : function() {
    return "javascript:(function(){f='" + document.location.origin + "/posts/new?url='+encodeURIComponent(window.location.href)+'&title='+encodeURIComponent(document.title)+'&notes='+encodeURIComponent(''+(window.getSelection?window.getSelection():document.getSelection?document.getSelection():document.selection.createRange().text))+'&v=1&';a=function(){if(!window.open(f+'noui=1&jump=doclose','diasporav1','menubar=no,location=no,links=no,scrollbars=no,toolbar=no,width=980,height=520'))location.href=f+'jump=yes'};if(/Firefox/.test(navigator.userAgent)){setTimeout(a,0)}else{a()}})()"
  },

  bookmarkletInstructionsPrompt : function(evt) {
    evt.preventDefault()
    alert("Drag me to the bookmarks bar to post to makr.io from anywhere on the web")
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
