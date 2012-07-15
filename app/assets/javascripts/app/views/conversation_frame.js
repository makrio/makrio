app.views.Post.ConversationFrame = app.views.Base.extend({

  className : 'row cnv-row',

  subviews : {
    //'.frame' : 'smallFrameView'
  },

  events : {
    "click .frame" : "goToCollection"
  },

  templateName : 'conversation-frame',

  initialize : function() {
    this.conversation = new app.models.Conversation(this.model.get("conversation"))
    this.latestPost = this.conversation.latest
    console.log(this.conversation)
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      conversation : this.conversation.attributes
    })
  },

//  smallFrameView : function() {
//    return new app.views.Post.SmallFrame({model : this.latestPost, className : "canvas-frame"})
//  },

  goToCollection : function(evt) {
    evt && evt.preventDefault()
    app.router.setLocation("/conversations/" + this.model.get('conversation_id'))
  }
});
