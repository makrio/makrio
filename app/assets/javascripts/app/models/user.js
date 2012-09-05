app.models.User = Backbone.Model.extend({
  url : function(){return '/' + this.get('username')},
  
  toggleNsfwState : function() {
    if(!app.currentUser.authenticated()){ return false }
    this.set({showNsfw : !this.get("showNsfw")});
    this.trigger("nsfwChanged");
  },

  authenticated : function() {
    return !!this.id;
  },

  expProfileUrl : function(){
    return "/people/" + app.currentUser.get("guid")
  },

  isServiceConfigured : function(providerName) {
    return _.include(this.get("configured_services"), providerName)
  },

  minted : function() {
    return this.authenticated() && this.get("getting_started") 
  },

  facebookToken : function(){
    var facebook = _.find(this.get('services'), function(obj){return obj.provider =='facebook'})
    return facebook ? facebook.access_token : ''
  }
});
