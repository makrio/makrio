//= require_self
//= require_tree ./helpers

//= require ./router
//= require ./models

//= require ./views
//= require ./pages
//= require ./views/infinite_stream_view

//= require_tree ./models
//= require_tree ./pages
//= require_tree ./collections
//= require_tree ./views
//= require_tree ./forms

var app = {
  collections: {},
  models: {},
  helpers: {},
  views: {},
  pages: {},
  forms: {},

  user: function(userAttrs) {
    if(userAttrs) { return this._user = new app.models.User(userAttrs) }
    return this._user || false
  },

  baseImageUrl: function(baseUrl){
    if(baseUrl) { return this._baseImageUrl = baseUrl }
    return this._baseImageUrl || "assets/"
  },

  subdomainRoutes : {
    '' : 'category'
  },

  initialize: function() {
    app.router = (window.location.subdomain() == '') ? new app.Router() : new app.Router({routes: this.subdomainRoutes});
    app.currentUser = app.user(window.current_user_attributes) || new app.models.User()

    // init header -- should be initializing a layout view here...
    this.initHeader()
    
    Backbone.history.start({pushState: true});

    // track sign-ups
    this.instrumentIncomingSignUpLinks()

    // there's probably a better way to do this...
    $("a[rel=backbone]").on("click", function(evt){
      evt.preventDefault();
      var link = $(this);

      $(".stream_title").text(link.text())
      app.router.navigate(link.attr("href").substring(1) ,true)
    })
  },

  initHeader : function() {
    app.header = new app.views.Header({page:this})
    $("body").prepend(app.header.render().el)
  },

  // small hack
  onStaffPicks : function() {
    return window.location.pathname.search("/staff_picks") != -1
  },

  hasPreload : function(prop) {
    return !!(window.preloads && window.preloads[prop]) //returning boolean variable so that parsePreloads, which cleans up properly is used instead
  },

  setPreload : function(prop, val) {
    window.preloads = window.preloads || {}
    window.preloads[prop] = val
  },

  parsePreload : function(prop){
      if(!app.hasPreload(prop)) { return }

      var preload = window.preloads[prop]
      delete window.preloads[prop] //prevent dirty state across navigates

      return(preload)
  },

  /* mixpanel wrapper function */
  instrument : function(type, name, object, callback) {
    if(!window.mixpanel) { return }
    window.mixpanel[type](name, ensureObject(object), callback)

    function ensureObject(object) {
      return typeof(object) !== 'undefined' ? object : {};
    }
  },

  instrumentIncomingSignUpLinks : function() {
    if(!window.mixpanel) { return }
    window.mixpanel["track_links"]("a#sign_up_button", "Click Sign Up");
  }
};

$(function() {
  app.initialize();
});
