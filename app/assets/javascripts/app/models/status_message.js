app.models.StatusMessage = app.models.Post.extend({
  url : function(){
    return this.isNew() ? '/status_messages' : '/posts/' + this.get("id");
  },

  defaults : {
    post_type : 'StatusMessage',
    text : "",
    photos : new Backbone.Collection(),
    author : app.currentUser ? app.currentUser.attributes : {}
  },

  prepareToRemix : function(parent){
    this.unset('favorite')
    this.unset('id')
    this.unset('guid')
    this.set('sourcePost', parent)
    this.set('parent_guid', parent.get('guid'))
    this.photos = new Backbone.Collection(this.get("photos"))
  },

  toJSON : function(){
    return {
      status_message : _.clone(this.attributes),
      aspect_ids : this.get("aspect_ids"),
      photos : this.photos && this.photos.pluck("id"),
      parent_guid : this.get('parent_guid'),
      services : this.get("services")
    }
  }
});
