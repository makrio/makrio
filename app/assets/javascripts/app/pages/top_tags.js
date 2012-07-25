app.pages.TopTags = app.views.Base.extend({
  templateName : 'top-tags',
  subviews :{
    'header' : 'headerView',
    '#user_pane' : 'userPaneView'
  },

  initialize : function(){
    this.headerView = new app.views.Header()
    this.userPaneView = new app.views.UserPaneView()

    this.model = new app.collections.Tags([], {})

    var self = this
    this.model.fetch().success(function(){
      self.render()
    })
  },

  presenter : function(){
    modelsJson = _.map(this.model.models, function(model){ return model.attributes})
    return {
      tags: modelsJson
    }
  }

})
