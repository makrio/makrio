app.views.LoginBanner =  app.views.Base.extend({
  templateName: 'login-banner',
  postRenderTemplate : function(){
    $('body').addClass('with-banner')
  }
})