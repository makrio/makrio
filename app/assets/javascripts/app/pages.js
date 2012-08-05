app.pages.Base = app.views.Base.extend({
  renderBaseViews : function() {
    this.initBaseViews()
    this.renderLoginBanner()
    this.renderHeader()

    this.renderSubviews(this.baseSubviews)
  },

  renderLoginBanner : function(){
    if(app.currentUser.authenticated()){ return }
    this.$el.append(this.loginBannerView.render().el)
  },

  renderHeader : function() {
    $("body").prepend(this.headerView.render().el)
  },

  initBaseViews : function() {
    this.loginBannerView = new app.views.LoginBanner()
    this.headerView = new app.views.Header({model : this.stream})
  }
});
