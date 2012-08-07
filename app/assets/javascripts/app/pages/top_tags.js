app.pages.TopTags = app.pages.Base.extend({
  templateName : 'top-tags',

  events : {
    "submit .find-topic" : "goToTopicPage"
  },

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
  },

  goToTopicPage : function(evt) {
    evt && evt.preventDefault()

    var originalQuery = $(evt.target).find("input[type=search]").val()
      , normalizedQuery = $.trim(originalQuery).replace(/\s+/g, ' ').replace(/\s/g, '-')

    window.location = "/topics/" + normalizedQuery

  }

})
