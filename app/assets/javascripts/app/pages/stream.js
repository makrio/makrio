app.pages.Stream = app.pages.Base.extend({
  templateName : "stream",

  subviews : {
    "#stream-content" : "streamView",
    '#new_posts_zone' : 'newPostsView'
  },

  initialize : function(options){
    var poll = (app.isOn('latest') || app.isOn('feed')) && !app.isOn('days_ago')

    this.stream = this.model = new app.models.Stream([], {poller: poll})
    this.stream.preloadOrFetch()
    this.onStream = options.onStream

    this.newPostsView = new app.views.NewPostNotifier({model : this.model, page: this})
    this.initSubviews()
    this.bindEvents()
  },

  initSubviews : function(){
    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
  },

  bindEvents : function(){
    this.stream.on("fetched", this.resetScrollSpy, this)
  },

  unbind : function(){
    this.stream.unbind()
    this.newPostsView.unbind()

    this.streamView.unbind()
    this.newPostsView.unbind()
  },

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
