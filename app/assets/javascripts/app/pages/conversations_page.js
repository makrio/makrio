//=require ./generic_canvas_page

app.pages.Conversations = app.pages.GenericCanvas.extend({
  templateName : "conversations-page",

  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView",
    "#user_pane" : "userPaneView",
    '#root-frame' : 'rootFrame',
    "#share-actions" : "shareView"
  },

  initialize : function(){
    this.model = new app.models.Conversation(app.parsePreload("conversation"))
    this.stream = new app.models.Stream([], { collectionOptions: {} })
    this.stream.preloadOrFetch()
    this.initSubviews()
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
