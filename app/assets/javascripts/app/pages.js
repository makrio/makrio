app.pages.Base = app.views.Base.extend({
  renderBaseViews : function() {
    if($("#header").length != 0) { return }
      
    this.headerView = new app.views.Header()
    $("body").prepend(this.headerView.render().el)
  }
});
