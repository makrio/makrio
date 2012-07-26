app.pages.SinglePostFrame = app.views.Base.extend({
  subviews : {
    '#the-frame' : 'frame'
  },

  templateName : 'single-frame',

  initialize : function(){
    this.frame = new app.views.Post.SmallFrame({
      model : this.model,
      className : "canvas-frame x2",
      composing : true
    })
  }
});
