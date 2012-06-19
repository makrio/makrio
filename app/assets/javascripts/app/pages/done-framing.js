app.pages.DoneFraming = app.views.Base.extend({
  id : 'framer-complete',
  templateName : 'done-framing',
  
  subviews : {
    '#share-actions' : 'shareView'
  },

  initialize : function(options){
    this.model = new app.models.Post({id : options.model_id })
    this.shareView = new app.views.ShareView({model : this.model})
  },

  postRenderTemplate : function(){
    setTimeout(window.close, 10000)
  }
})
