app.views.ConversationRow = app.views.Base.extend({
  templateName : "conversation-row",
  subviews : {
    '.frame-viewer' : 'frameView'
  },

  initialize : function(){
    this.conversation = new app.models.Conversation(this.model.get('conversation'))
    this.frameView = new app.views.Post.SmallFrame({model : this.conversation.latest, className : "canvas-frame"})

  }
});