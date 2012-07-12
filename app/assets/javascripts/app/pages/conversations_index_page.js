app.pages.ConversationsIndex = app.views.Base.extend({
    templateName : "conversations-index",

    events : {
      "click *[data-remix-id]" : 'showModalFramer'
    },

    subviews : {
      "header" : "headerView",
      "#stream-content" : "streamView"
    },

    initialize : function(){
      this.stream = this.model = new app.models.Stream()
      this.stream.preloadOrFetch()

      this.initSubviews()
      this.bindEvents()
    },

    initSubviews : function(){
      this.headerView = new app.views.Header({model : this.stream})
      this.streamView = new app.pages.Stream.InfiniteScrollView({ model : this.stream })
      this.streamView.postClass = app.views.Post.ConversationFrame

      this.postClass = app.views.Post.ConversationFrame

    },

    bindEvents : function() {

    },

    unbind : function(){
      this.stream.unbind()
    }
  },

//static methods
  {
    InfiniteScrollView : app.views.InfScroll.extend({
      initialize: function(){
        this.stream = this.model
        this.collection = this.stream.items
        this.setupInfiniteScroll()
      }
    })
  });
