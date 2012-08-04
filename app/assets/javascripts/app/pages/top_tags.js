app.pages.TopTags = app.pages.Base.extend({
  templateName : 'top-tags',

  initialize : function(){
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
