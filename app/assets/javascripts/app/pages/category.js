app.pages.Category = app.pages.Base.extend({
  templateName : "category-page",

  initialize : function(){
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      subdomain : window.location.subdomain()
    })
  }
});
