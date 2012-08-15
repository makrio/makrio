app.views.SignUpBannerView = app.views.Base.extend({
  templateName : 'sign-up-banner',

  presenter : function(){
    return {
      onFrontPage : window.location.pathname == '/'
    }
  }
});


app.pages.Base = app.views.Base.extend({
  renderBaseViews : function() {
    if($("#header").length != 0) { return }
      
    this.headerView = new app.views.Header()
    $("body").prepend(this.headerView.render().el)

    if(!app.currentUser.authenticated()){
      var signUp = this.$('#sign_up_strip') // I am faking this, sorry
      if(signUp.length ==1){
        this.signUpBannerView = new app.views.SignUpBannerView({model: this.model})
        $('#header').after(this.signUpBannerView.render().el)
      }
    }
  }
});
