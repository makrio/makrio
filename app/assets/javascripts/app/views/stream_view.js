app.views.Stream = app.views.InfScroll.extend({
  postClass : app.views.StreamPost,

  initialize: function(options) {
    this.stream = this.model
    this.collection = this.stream.items

    this.postViews = []

    this.setupNSFW()
    this.setupInfiniteScroll()
  },

  unbind : function() {
    this.unbindInfScroll()
  },

  setupNSFW : function(){
    app.currentUser.bind("nsfwChanged", reRenderPostViews, this)

    function reRenderPostViews() {
      _.map(this.postViews, function(view){ view.render() })
    }
  }
});
