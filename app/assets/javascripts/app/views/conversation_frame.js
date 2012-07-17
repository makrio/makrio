app.views.Post.ConversationFrame = app.views.Base.extend({

  className : 'full-conversation row',

  subviews : {
    '.conversation-feedback' : 'feedbackView'
  },
  templateName : 'conversation-frame',

  initialize : function() {
    this.original = this.model
    this.conversation = new app.models.Conversation(this.model.get("conversation"))
    this.model = this.conversation.latest
    this.feedbackView = new app.views.ViewerFeedbackActions({model : this.model})

  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      conversation : this.conversation.attributes,
      original : this.original.attributes,
      showOriginal : this.showOriginal()
    })
  },

  showOriginal : function() {
    return this.model.get('id') != this.original.get('id')
  }
});
