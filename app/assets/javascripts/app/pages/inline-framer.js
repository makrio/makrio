app.pages.FramerWithLightBoxNavigate = app.pages.Framer.extend({
  navigateNext : function(){
    if(app.currentUser.minted()){
      app.router.setLocation('/latest')
    } else{
    this.trigger('complete')
    var done = new app.pages.DoneFraming({model : this.model})
    this.showModal(done)
  }
  }
})

app.views.InlineFramer = app.views.Base.extend({
  initialize :function(options){
    this.framer = new app.pages.FramerWithLightBoxNavigate({ model : this.model, tag: options.tag})
    this.bindEvents()
  },

  bindEvents : function(){
    $(document).on('afterClose.facebox', _.bind(this.teardown, this))
  },

  unbindEvents : function(){
    $(document).off('afterClose.facebox')
  },

  show : function(){
    $.facebox(this.framer.render().el)
  },

  teardown :function(){
    $("#peekaboo").addClass("peek");
    setTimeout("$('#peekaboo').removeClass('peek')", 5000);

    $.facebox.close()
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
