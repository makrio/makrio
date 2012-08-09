app.views.Canvas = app.views.InfScroll.extend({
  scrollOffset : 1000,

  initialize: function(){
    this.stream = this.model
    this.collection = this.stream.items
    this.postClass = app.views.Post.CanvasFrame
    this.postViews = []
    this.setupInfiniteScroll()
    this.stream.bind("reLayout", this.reLayout, this)
    this.stream.bind("fetched", this.addPosts, this)
  },

  renderTemplate : function() {
    this.stream.deferred.done(_.bind(function(){
      if(this.stream.items.isEmpty()){
        var message
          , person = app.page.model

        if(app.onInterests){
          message = "<h2>Makr.io is smart about showing you content you love.</h2> \
                    <h3>This stream is based on content you've liked and content you've created.</h3> \
                    <br> \
                    You can choose what you see here by <strong>liking</strong> or <strong>creating</strong> content that reflects your interests. \
                    <br> \
                    Click <a href='/front_page'>Explore</a> to discover great new content."

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
      _.defer(_.bind(this.mason, this))
    }, this))
  },

  addPosts : function() {
    var newElements = $(this.flushViewBuffer()) 
    this.$el.append(newElements)
    this.$el.masonry("appended", newElements)
  },

  //overridden from stream base class
  prependToStream : function(el){
    $('.first-frame').after(el)
    this.reLayout()
  },

  mason : function() {
    /* make two calls to masonry
       1) on dom ready
       2) on images ready
     */
    triggerMasonry(this.$el) && this.$el.imagesLoaded(_.bind(function(){
      this.reLayout()
    },this))

    function triggerMasonry(element) {
      return element.masonry({
        itemSelector : '.mason'
      })
    }
  },

  triggerRelayoutAfterImagesLoaded : function(){
    //event apparently only fires once
    this.$el.imagesLoaded(_.bind(this.reLayout, this))
  },

  reLayout : function(){
    this.$el.masonry("reload")
  }
});
