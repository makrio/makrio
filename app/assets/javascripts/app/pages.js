app.views.SignUpBanner = app.views.Base.extend({
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
  // default options object to be overridden
  // this ensures presence of the object.
  options: {},
  unbind: $.noop
});
