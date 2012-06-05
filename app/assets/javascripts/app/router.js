app.Router = Backbone.Router.extend({
  routes: {
    //new hotness
    "stream": "newStream",
    "stream?*params": "newStream",
    "people/:id": "newProfile",
    "u/:name": "newProfile",

    "posts/new" : "composer",
    "posts/:id": "singlePost",
    "posts/:id/next": "siblingPost",
    "posts/:id/previous": "siblingPost",
    "p/:id": "singlePost",
    "framer": "framer"
  },

  newStream : function() {
    this.renderPage(function(){ return new app.pages.Stream()});
  },

  newProfile : function(personId) {
    this.renderPage(function(){ return new app.pages.Profile({ personId : personId })});
  },

  composer : function(){
    app.instrument("track", "Compose")
    this.renderPage(function(){ return new app.pages.Composer()});
  },

  framer : function(){
    app.instrument("track", "Frame")
    this.renderPage(function(){ return new app.pages.Framer()});
  },

  singlePost : function(id) {
    this.renderPage(function(){ return new app.pages.PostViewer({ id: id })});
  },

  siblingPost : function(){ //next or previous
    var post = new app.models.Post();
    post.bind("change", setPreloadAttributesAndNavigate)
    post.fetch({url : window.location})

    function setPreloadAttributesAndNavigate(){
      window.preloads.post = post.attributes
      app.router.navigate(post.url(), {trigger:true, replace: true})
    }
  },

  renderPage : function(pageConstructor){
    app.page && app.page.unbind && app.page.unbind() //old page might mutate global events $(document).keypress, so unbind before creating
    app.page = pageConstructor() //create new page after the world is clean (like that will ever happen)
    $("#container").html(app.page.render().el)
  }
});

