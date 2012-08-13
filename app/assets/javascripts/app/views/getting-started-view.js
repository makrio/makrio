app.views.GettingStarted = app.views.Base.extend({
  id:'getting_started',
  templateName : 'getting-started',
  events : {
    'click #next_step_link' : 'navigateToNext',
    'click #done' : 'finished'
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

  navigateToNext : function(evt) {
    evt && evt.preventDefault()
    this.$("#gs_1").hide()
    this.$("#gs_2").show()
  },

  finished : function(evt){
    evt && evt.preventDefault()
    window.location = $('.liked').length > 0 ? '/interests' : '/top_tags'
  }
});
