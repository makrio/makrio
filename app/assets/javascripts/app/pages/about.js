app.pages.Info = app.pages.Base.extend({
  subviews : {
    'header' : 'headerView',
    "#user_pane" : "userPaneView"
  },

  initialize : function(){
    this.headerView = new app.views.Header({})
    this.userPaneView = new app.views.UserPaneView()
  },

  presenter : function(){
    return {
      bookmarklet : this.bookmarkletJS()
    }
  }
});

app.pages.About = app.pages.Info.extend({
  templateName : 'about',
})

app.pages.ProTips = app.pages.Info.extend({
  templateName : 'pro-tips'
});