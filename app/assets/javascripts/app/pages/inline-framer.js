app.pages.FramerWithLightBoxNavigate = app.pages.Framer.extend({
  navigateNext : function(){
    this.trigger('complete')
  }
})

app.pages.InlineFramer = app.views.Base.extend({
  initialize :function(){
    this.framer = new app.pages.FramerWithLightBoxNavigate({ model : this.model})
    this.bindEvents()
  },

  bindEvents : function(){
    this.framer.on('complete', this.teardown, this)
  },

  unbindEvents : function(){
    this.framer.off('complete')
  },

  show : function(){
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
})