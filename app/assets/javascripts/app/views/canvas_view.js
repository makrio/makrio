app.views.Canvas = app.views.InfScroll.extend({
  scrollOffset : 1000,

  initialize: function(){
    this.stream = this.model
    this.collection = this.stream.items
    this.postClass = app.views.Post.CanvasFrame
    this.postViews = []
    this.setupInfiniteScroll()
    this.stream.bind("reLayout", this.reLayout, this)
    this.stream.bind("fetched", this.triggerRelayoutAfterImagesLoaded, this)
  },

  renderTemplate : function() {
    this.stream.deferred.done(_.bind(function(){
      if(this.stream.items.isEmpty()){
        var message
          , person = app.page.model

        if(app.onInterests){
          message = "Start liking things, and this will be populated"

        } else if(person && person.get("is_own_profile")){
          message = "Make something to start the magic."
        } else {
          var name = person ? person.get("name") : ""
          message = "There isn't anything here yet."
        }

        this.$el.html("<p class='no-post-message'>" + message + "</p>")
      } else {
        this.renderInitialPosts()
      }

      //needs to be deferred so it happens after html rendering finishes
      _.delay(_.bind(this.mason, this), 2000)
    }, this))
  },

  addPosts : function() {
    if (this.$el.masonry){
      var $items = this.flushViewBuffer()
      this.$el.append($items)
      this.$el.masonry("layout", $items)
    }
  },

  mason : function() {
     this.$el.imagesLoaded(_.bind(function(){
      console.log('firing', this.$el)
      this.$el.masonry({
        itemSelector : ".mason",
      });
    },this));

  },

  triggerRelayoutAfterImagesLoaded : function(){
    //event apparently only fires once
    this.$el.imagesLoaded(_.bind(this.reLayout, this))
  },

  reLayout : function(){
   this.$el.masonry("reload")
  }
});
