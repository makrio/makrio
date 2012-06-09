app.models.StatusMessage = app.models.Post.extend({
  url : function(){
    return this.isNew() ? '/status_messages' : '/posts/' + this.get("id");
  },

  defaults : {
    'post_type' : 'StatusMessage',
    'author' : app.currentUser ? app.currentUser.attributes : {}
  },

  prepareToRemix : function(root){
    this.unset('favorite')
    this.unset('id')
    this.unset('guid')
    this.set('sourcePost', root)
    this.photos = new Backbone.Collection(this.get("photos"))
  },

  toJSON : function(){
    return {
      status_message : _.clone(this.attributes),
      aspect_ids : this.get("aspect_ids"),
      photos : this.photos && this.photos.pluck("id"),
      services : this.get("services")
    }
  }
});
