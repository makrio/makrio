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
    $(document).on('afterClose.facebox', function(){
      console.log('closing facebox')
    })

    var self = this;
    this.framer.on('complete', function(){
      self.teardown();
    })
  },

  unBindEvents : function(){
    //afterclose
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
  }
})