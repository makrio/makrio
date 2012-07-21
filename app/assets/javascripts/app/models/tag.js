app.models.Tag = Backbone.Model.extend({
  urlRoot : "/tags",

  url : function(){
    return this.urlRoot + '/' + this.get('name')
  },
  initialize : function() {},


})