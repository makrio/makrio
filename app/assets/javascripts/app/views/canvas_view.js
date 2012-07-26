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
        if(person && person.get("is_own_profile")){
          message = "Make something to start the magic."
        } else {
          var name = person ? person.get("name") : ""
          message = name + " hasn't posted anything yet."
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
    this.$el.isotope("insert", $(this.flushViewBuffer()))
  },

  mason : function() {
    /* make two calls to isotope
       1) on dom ready
       2) on images ready
     */
    triggerIsotope(this.$el) && this.$el.imagesLoaded(_.bind(function(){
      this.reLayout()
    },this))

    function triggerIsotope(element) {
      return element.isotope({
        itemSelector : '.mason',
        transformsEnabled : false,
        visibleStyle : {scale : 1},
        hiddenStyle : {scale : 0.001},
        containerStyle : {position : "relative"},
        masonry : {
          columnWidth : 1
        }
      })
    }
  },

  triggerRelayoutAfterImagesLoaded : function(){
    //event apparently only fires once
    this.$el.imagesLoaded(_.bind(this.reLayout, this))
  },

  reLayout : function(){
    this.$el.isotope("reLayout")
  }
});
