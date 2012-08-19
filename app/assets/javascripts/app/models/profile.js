app.models.Profile = Backbone.Model.extend({
  urlRoot : "/profiles"
}, {

  preloadOrFetch : function(username){
    return app.hasPreload("person") ? this.preload() : this.findByUsername(username)
  },

  preload : function(){
    var person = new app.models.Profile(app.parsePreload("person"))
    person.deferred = $.when(true)
    return person
  },

  findByUsername : function(username){
    var person =  new app.models.Profile({id : username})
    person.deferred = person.fetch()
    return person
  }
});