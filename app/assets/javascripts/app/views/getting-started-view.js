app.views.GettingStarted = app.views.Base.extend({
  templateName : 'getting-started',

  events : {
    "close.facebox" : "preventFaceboxFromClosing"
  },

  initialize : function(){
    var posts = app.parsePreload('gettingStarted')
    this.collection = new app.collections.Posts(posts, {})

    /* prevent the facebox from being closed */
    $(document).off('close.facebox')
  },

  postRenderTemplate : function(){
    var that = this
    _.each(this.collection.models, function(model){
      var view = new app.views.Post.BasicScreenshot({model : model, normalizedCollection: true, composing: true})
      that.$el.find('#canvas').append(view.render().$el)
    })
  },

  preventFaceboxFromClosing : function() {
    return false;
  }
});
