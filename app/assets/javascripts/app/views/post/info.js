app.views.Info = app.views.Base.extend({
  templateName : "small-frame/info",

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onProfilePage : app.onProfilePage
    })
  }
})