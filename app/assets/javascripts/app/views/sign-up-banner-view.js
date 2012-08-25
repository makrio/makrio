app.views.SignUpBanner = app.views.Base.extend({
  templateName : 'sign-up-banner',

  events : {
    "click .learn-more-btn" : "toggleLearnMore"
  },

  presenter : function(){
    return {
      onFrontPage : window.location.pathname == '/'
    }
  },

  postRenderTemplate : function(){
    var words = ['nonsense', 'parties', 'laughs', 'stories', 'culture', 'sloths', 'awesome', 'fun', 'love', 'remixes','pizza', 'jokes',"high-5s", 'fuzzies', 'moments', 'lolz', 'in-jokes']
    _.delay(function(){$('#typist').loadText(words, 5000)}, 3000)
  },

  toggleLearnMore : function() {
    this.$(".more-info").slideToggle()
  }
});
