app.views.UserPaneView = app.views.Base.extend({
  templateName : "user-pane",
  postRenderTemplate : function(){
    this.$('.sub li').tooltip({placement: 'left', delay: { show: 300, hide: 100 }});
  }
});
