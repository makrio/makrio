app.pages.Info = app.pages.Base.extend({
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