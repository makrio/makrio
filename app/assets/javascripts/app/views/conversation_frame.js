app.views.Post.ConversationFrame = app.views.Base.extend({

  className : 'row cnv-row',

  events : {
    "click .frame" : "goToCollection"
  },

  templateName : 'conversation-frame',

  initialize : function() {
    this.conversation = new app.models.Conversation(this.model.get("conversation"))
    this.latestPost = this.conversation.latest
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      conversation : this.conversation.attributes
    })
  },

  goToCollection : function(evt) {
    evt && evt.preventDefault()
    app.router.setLocation("/conversations/" + this.model.get('conversation_id'))
  }
});
