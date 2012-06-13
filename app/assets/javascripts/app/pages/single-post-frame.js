app.pages.SinglePostFrame = app.views.Base.extend({
  templateName : "single-frame",
  subviews : {
    '.frame' : 'streamFrame'
  },

  streamFrame : function(){
    return new app.views.Post.StreamFrame({model : this.model})
  }
})
