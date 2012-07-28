app.pages.About = app.pages.Base.extend({
  templateName : 'about',
  subviews : {
    'header' : 'headerView'
  },

  initialize : function(){
    this.headerView = new app.views.Header({})
  }
})