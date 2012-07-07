app.pages.StyleGuide = app.views.Base.extend({
  subviews : {
    '#big-frame' : 'bigFrame',
    '#canvas-frame' : 'canvasFrame',
    '#big-canvas-frame' : 'bigCanvasFrame',
    '#small-frame' : 'smallFrame',
    '#stream-frame' : 'streamFrame',
    '#big-framer' : 'framer'

  },

  templateName : 'styleguide',

  initialize : function(){
    this.model.set({'show_screenshot' : false})

    this.bigFrame = new app.views.Post.SmallFrame({
      model : this.model,
      className : "canvas-frame x2 height width",
      composing : true
    })

    this.smallFrame = new app.views.Post.SmallFrame({
      model : this.model,
      className : "canvas-frame",
      composing : true
    })

    this.canvasFrame = new app.views.Post.CanvasFrame({
      model : this.model,
      composing : true
    })


    this.bigCanvasFrame = new app.views.Post.CanvasFrame({
      model : this.model,
      className : 'canvas-frame  x2',
      composing : true
    })

    this.streamFrame = new app.views.Post.StreamFrame({
      model : this.model,
      composing : true
    })


    this.framer = new app.pages.Framer({
      model : this.model
    }) 
  }

})
