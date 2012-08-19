//= require ../views/profile_info_view

app.pages.Profile = app.pages.Base.extend({
  templateName : "profile",
  id : "profile",

  subviews : {
    "#profile-info" : "profileInfo",
    "#canvas" : "canvasView"
  },

  tooltipSelector : "*[rel=tooltip]",

  username : null,

  initialize : function(options) {
    this.model = this.model || app.models.Profile.preloadOrFetch(options.username)
    this.stream = options && options.stream || new app.models.Stream()
    this.stream.preloadOrFetch()

    this.initViews()
  },

  initViews : function(){
    this.canvasView = new app.views.Canvas({
      model: this.stream,
      onProfilePage: true
    })
    this.profileInfo = new app.views.ProfileInfo({ model : this.model })
  },

  render :function () {
    var self = this;
    this.model.deferred
      .done(function () {
        self.setPageTitle()
        app.views.Base.prototype.render.call(self)
      })

    return self
  },
  
  setPageTitle : function() {
    if(this.model.get("name")) {
      document.title = this.model.get("name")
    }
  }
});