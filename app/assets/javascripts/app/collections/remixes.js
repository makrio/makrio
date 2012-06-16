app.collections.Remixes = Backbone.Collection.extend({
  model: app.models.Remix,
  url : "/posts"
});
