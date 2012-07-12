//=require ./generic_canvas_page

app.pages.ConversationsIndex = app.views.Base.extend({
  templateName : "conversations-index",

  subviews : {
    "header" : "headerView",
    '#canvas' : 'streamView'
  },

  initialize : function(){
    this.stream =  new app.models.Stream()
    this.stream.preloadOrFetch()
    this.initSubviews()
  },

  initSubviews : function(){
    this.headerView = new app.views.Header({model : this.stream})
    this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
    this.streamView.postClass = app.views.ConversationRow

  }
});
