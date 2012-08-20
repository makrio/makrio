app.views.NewPostNotifier = app.views.Base.extend({
  templateName : 'post-notifier',
  className :'post-notifier',

  events : {
    "click" : "loadNewPosts",
  },

  //a stream MUST be the model
  initialize : function(options){
    this.stream = this.model
    this.page = options.page
    this._pageTitle = document.title

    this.bindEvents()
  },

  presenter : function(){
    return {
      count : this.count(),
      noun : this.noun()
    }
  },

  count : function(){
    return this.stream.poller && this.stream.poller.models.length
  },

  noun : function(){
    return this.count() == 1 ? "Post" : "Posts";
  },

  bindEvents : function(){
    this.stream.on("hasMoar", this.notifyUserOfMorePosts, this)
  },

  unbind : function(){
    this.stream.off("hasMoar", this.notifyUserNewPosts, this)
  },

  loadNewPosts : function(){
    this.$el.hide()
    this.stream.trigger("loadNew")
    document.title = this._pageTitle;

    //allow page to know that things happpend...should be event?
    this.page.prependedPosts && this.page.prependedPosts()
    $(window).trigger("scroll").scrollTop(0)
  },

  updatePageTitle : function(){
    document.title = "(" + this.count() + ") " + this._pageTitle
  },

  notifyUserOfMorePosts : function(){
    this.updatePageTitle()
    this.$el.show()
    this.render()
  }
});
