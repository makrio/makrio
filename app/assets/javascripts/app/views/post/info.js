app.views.Info = app.views.Base.extend({
  templateName : "small-frame/info",

  events : {
    'click .icon-comment' : 'showModalComments'
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onProfilePage : app.onProfilePage
    })
  },

  showModalComments : function(){
    this.modalComments = new app.views.InlineComments({model : this.model})
    this.modalComments.show();
  }
})