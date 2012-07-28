app.pages.About = app.pages.Base.extend({
  templateName : 'about',
  subviews : {
    'header' : 'headerView',
    "#user_pane" : "userPaneView"
  },

  initialize : function(){
    this.headerView = new app.views.Header({})
    this.userPaneView = new app.views.UserPaneView()
  }
});

app.pages.ProTips = app.pages.About.extend({
  templateName : 'pro-tips'

});