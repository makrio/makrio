app.views.Post.ConversationFrame = app.views.Base.extend({

  className : 'row cnv-row',

  templateName : 'conversation-frame',

  initialize : function() {
    this.conversation = new app.models.Conversation(this.model.get("conversation"))
    this.latestPost = this.conversation.latest
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      conversation : this.conversation.attributes
    })
  }
});
