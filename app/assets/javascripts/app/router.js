app.Router = Backbone.Router.extend({
  routes: {
    //new hotness
    "stream": "newStream",
    "stream?*params": "newStream",
    "people/:id": "newProfile",
    "u/:name": "newProfile",

    "posts/:id/remix?*params" : 'remix', // facebook action links supply signed_request params
    "posts/:id/remix" : 'remix',
    "posts/new" : "redirectToFramer",

    "framer": "framer",
    "framer?*params": "framer", // bookmarklet has params

    "posts/:id?:params": "singlePost",
    "posts/:id": "singlePost",
    "posts/:id/frame": "singlePostFrame",
    "p/:id?:params": "singlePost",
    "p/:id": "singlePost",

    "posts/:id/next": "siblingPost",
    "posts/:id/previous": "siblingPost"
  },

  redirectToFramer : function(){
    app.router.navigate("/framer", true)
  },

  newStream : function() {
    app.instrument("track", "Stream loaded")
    this.renderPage(function(){ return new app.pages.Stream()});
  },

  remix : function(id){
    var remixed = new app.models.StatusMessage({id : id})
    remixed.fetch().success(_.bind(function(){

      var new_mix = new app.models.StatusMessage(_.clone(remixed.attributes))
      new_mix.prepareToRemix(remixed)
      this.renderPage(function(){ return new app.pages.Framer({model : new_mix })});
    }, this)).fail(function(){alert('There was an error loading the Remix. Please Try Refreshing.')});
  },

  newProfile : function(personId) {
    this.renderPage(function(){ return new app.pages.Profile({ personId : personId })});
  },

  framer : function(params){
    if(params){
      var url = params.split('&')[0].replace('remoteurl=', '')
      app.remotePhotoUrl  = decodeURIComponent(url)
    } 
    app.instrument("track", "Compose")
    this.renderPage(function(){ return new app.pages.Framer()});
  },

  singlePost : function(id) {
    this.renderPage(function(){ return new app.pages.PostViewer({ id: id })});
  },

  singlePostFrame : function(id) {
    var model = new app.models.Post({ id : id })
      , self = this;

    model.preloadOrFetch()
      .done(function(resp){
        self.renderPage(function(){ return new app.pages.SinglePostFrame({model: resp}) })
      })
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

