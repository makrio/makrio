app.models.Conversation = Backbone.Model.extend({
  urlRoot : "/conversations",

  initialize : function() {
    this.original = new app.models.Post(this.get("original"))
  }

});
