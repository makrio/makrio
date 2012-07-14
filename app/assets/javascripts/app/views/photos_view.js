app.views.Photos = app.views.InfScroll.extend({
  initialize : function(options) {
    this.stream = this.model;
    this.collection = this.stream.items;

    // viable for extraction
    this.stream.fetch();

    this.setupInfiniteScroll()
  },

  postClass : app.views.Photo,

});
