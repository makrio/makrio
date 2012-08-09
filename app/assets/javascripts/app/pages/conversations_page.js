//=require ./generic_canvas_page
app.views.BrandView = app.pages.Base.extend({
  templateName : 'brand-view'
});

app.pages.Conversations = app.pages.GenericCanvas.extend({
  templateName : "conversations-page",

  subviews : {
    "#canvas" : "canvasView",
    '#root-frame' : 'rootFrame',
    "#share-actions" : "shareView",
    '#brand-banner' : 'brandView'
  },

  events : {
    'click #cnv_rmx_btn' : 'showModalFramer'
  },

  initialize : function(){
    this.model = new app.models.Conversation(app.parsePreload("conversation"))
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      isBrand : this.isBrand()
    })
  },

  isBrand: function(){
    return this.model.get('original').author.name == 'imgfave'
  },

  brandView : function(){
    if(this.isBrand()){
      return new app.views.BrandView({model : this.model})
    }
  },

  rootFrame : function(){
    return new app.views.Post.CanvasFrame({
      model : this.model.original,
      className : "canvas-frame x2",
      composing : true
    })
  },

  shareView : function() {
    return new app.views.ShareView({
      model : this.model,
      title : this.model.original.get("title")
    })
  }
});
