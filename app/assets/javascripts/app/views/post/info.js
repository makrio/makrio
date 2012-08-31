app.views.Info = app.views.Base.extend({
  templateName : "small-frame/info",

  events : {
    'click .icon-comment' : 'showModalComments'
  },

  initialize : function(options) {
    this.hideAuthor = options && options.hideAuthor
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      onProfilePage : app.isOn(app.currentUser.get('username')) || this.hideAuthor
    })
  },

  showModalComments : function(){
    this.modalComments = new app.views.InlineComments({model : this.model})
    this.modalComments.show();
  }
})