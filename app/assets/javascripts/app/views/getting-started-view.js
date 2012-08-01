app.views.GettingStarted = app.views.Base.extend({
  id:'getting_started',
  templateName : 'getting-started',
  events : {
    'click #done' : 'navigateToNext'
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

  navigateToNext : function(evt){
    evt && evt.preventDefault()

    var likes = $('.liked').length

    console.log(likes, 'foo')
    var url = likes > 0 ? '/interests' : '/top_tags'
    window.location = url
  }
});
