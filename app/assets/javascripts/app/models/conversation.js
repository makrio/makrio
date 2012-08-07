app.models.Conversation = Backbone.Model.extend({
  urlRoot : "/conversations",

  initialize : function() {
    this.original = new app.models.Post(this.get("original"))
    this.latest = new app.models.Post(this.get("latest"))
  },

  buildRemix : function(){
    return this.original.buildRemix()
  }

});
