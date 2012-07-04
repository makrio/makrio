//= require ../collections/posts
//= require ../collections/photos

app.collections.PostPoller = app.collections.Posts.extend({
  url:function () {
    return "/stream/updated?last_post_id=" + this.stream.items.first().id
  },

  initialize:function (models, options) {
    this.stream = options.stream
    this.bindEvents()
  },

  comparator: function(post){
    return post.createdAt()
  },

  bindEvents : function(){
    this.on("FetchMoar", this.fetchMore, this)
  },

  unbind : function(){
    this.off("FetchMoar", this.fetchMore, this)
  },

  fetchMore:function() {
    var self = this
    this.fetch({add:true}).done(function() {
      if (self.models.length) {
        self.stream.trigger("hasMoar")
      }
      _.delay(function(){
        self.trigger("FetchMoar")
      }, 20000)
    })
  }
})

app.models.Stream = Backbone.Collection.extend({
  initialize : function(models, options){
    var collectionClass = options && options.collection || app.collections.Posts;
    var collectionOpts = options && options.collectionOptions || this.collectionOptions()

    this.items = new collectionClass([], collectionOpts);
    this.on("loadNew", this.addPollerPosts, this)
  },

  addPollerPosts : function(){
    this.poller.each(_.bind(function(post){
      this.add(post)
    }, this))
    this.poller.reset()
  },

  unbind : function(){
    this.poller && this.poller.unbind()
  },

  collectionOptions : function(){
      var order = this.sortOrder();
      return { comparator : function(item) { return -item[order](); } }
  },

  url : function(){
    return _.any(this.items.models) ? this.timeFilteredPath() : this.basePath()
  },

  fetch: function() {
    if(this.isFetching()){ return false }
    var url = this.url()
    this.deferred = this.items.fetch({
        add : true,
        url : url
    }).done(_.bind(this.triggerFetchedEvents, this))
  },

  isFetching : function(){
    return this.deferred && this.deferred.state() == "pending"
  },

  triggerFetchedEvents : function(resp){
    this.trigger("fetched", this);
    // all loaded?
    var respItems = this.items.parse(resp);
    if(respItems && (respItems.author || respItems.length == 0)) {
      this.trigger("allItemsLoaded", this);
    }
  },

  basePath : function(){
    return document.location.pathname;
  },

  timeFilteredPath : function(){
   return this.basePath() + "?max_time=" + this.maxTime();
  },

  maxTime: function(){
    var lastPost = _.last(this.items.models);
    return lastPost[this.sortOrder()]()
  },

  sortOrder : function() {
    return (window.location.pathname.search(/^\/stream/) != -1 ? "createdAt" : "staffPickedAt")
  },

  add : function(models){
    this.items.add(models)
  },

  preloadOrFetch : function(){ //hai, plz test me THNX
    var deferred =  $.when(app.hasPreload("stream") ? this.preload() : this.fetch())

    if(window.location.pathname.search(/^\/stream/) != -1) {
      this.poller = new app.collections.PostPoller([], {stream : this})
      deferred.done(_.bind(this.poller.fetchMore, this.poller))
    }

    return deferred
  },

  preload : function(){
    this.items.reset(app.parsePreload("stream"))
    this.deferred = $.when(true)
    this.trigger("fetched")
  }
});
