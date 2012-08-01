app.views.GettingStarted = app.views.Base.extend({
  templateName : 'getting-started',

  initialize : function(){
    var posts = app.parsePreload('gettingStarted')
    this.collection = new app.collections.Posts(posts, {})
  },

  postRenderTemplate : function(){
    var that = this
    _.each(this.collection.models, function(model){
      console.log('bonersauce')
      var view = new app.views.Post.BasicScreenshot({model : model, normalizedCollection: true})
      that.$el.find('#canvas').append(view.render().$el)
    })
  }
})