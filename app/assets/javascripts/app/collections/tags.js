app.collections.Tags = Backbone.Collection.extend({
  model: app.models.Tag,
  url : function(){
    return "/top_tags"
  }
});
