//= require ../views/profile_info_view

app.pages.Profile = app.views.Base.extend({
  templateName : "profile",
  id : "profile",

  subviews : {
    "#profile-info" : "profileInfo",
    "#canvas" : "canvasView"
  },

  tooltipSelector : "*[rel=tooltip]",

  personGUID : null,

  initialize : function(options) {
    this.personGUID = options.personId

    this.model = this.model || app.models.Profile.preloadOrFetch(this.personGUID)
    this.stream = options && options.stream || new app.models.Stream()
    this.stream.preloadOrFetch()

    this.initViews()
  },

  initViews : function(){
    this.canvasView = new app.views.Canvas({ model : this.stream })
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

  presenter : function(){
    var bio =  this.model.get("bio") || ''

    return _.extend(this.defaultPresenter(), {
      text : this.model && app.helpers.textFormatter(bio, this.model)
    })
  },

  setPageTitle : function() {
    if(this.model.get("name")) {
      document.title = this.model.get("name")
    }
  }
});
