app.pages.FramerWithLightBoxNavigate = app.pages.Framer.extend({
  navigateNext : function(){
    this.trigger('complete')
  }
})

app.views.InlineFramer = app.views.Base.extend({
  initialize :function(options){
    this.framer = new app.pages.FramerWithLightBoxNavigate({ model : this.model, tag: options.tag})
    this.bindEvents()
  },

  bindEvents : function(){
    this.framer.on('complete', this.teardown, this)
  },

  unbindEvents : function(){
    this.framer.off('complete')
  },

  show : function(){
    $.facebox.settings.closeImage = '/assets/facebox/closelabel.png';
    $.facebox.settings.loadingImage = '/assets/facebox/loading.gif';
    $.facebox.settings.opacity = 0.9;
    this.framer.render()
    $.facebox(this.framer.el)
  },

  teardown :function(){
    $.facebox.close()
    var flash = new Diaspora.Widgets.FlashMessages;
    flash.render({
      success: true,
      notice: "Remix Posted!"
    });
    this.unbindEvents()
  }
});

app.views.InlineComments = app.views.Base.extend({
    templateName : "inline-comments",

    subviews : {
      '.comments' : 'comments',
      '.new-comment' : 'newCommentView'
    },

    initialize :function(){
      this.comments = new app.views.PostViewerComments({ model: this.model.interactions })
      this.newCommentView = new app.views.PostViewerNewComment({ model : this.model })
    },
});

app.views.InlineLogin = app.views.Base.extend({
    templateName : 'sign-in',
    postRenderTemplate : function(){
      this.$("input[name=authenticity_token]").val($("meta[name=csrf-token]").attr("content"))
    },
})
