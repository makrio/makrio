app.views.SignUpBannerView = app.views.Base.extend({
  templateName : 'sign-up-banner',

  presenter : function(){
    return {
      onFrontPage : window.location.pathname == '/'
    }
  },

  postRenderTemplate : function(){
    var words = ['nonsense', 'parties', 'laughs', 'stories', 'culture', 'sloths', 'awesome', 'fun', 'love', 'remixes','pizza', 'jokes',"high-5s", 'fuzzies', 'moments', 'lolz', 'in-jokes']
    _.delay(function(){$('#typist').loadText(words, 5000)}, 3000)
  }
});


app.pages.Base = app.views.Base.extend({
  renderBaseViews : function() {
    if($("#header").length != 0) { return }
      
    this.headerView = new app.views.Header({page:this})
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
