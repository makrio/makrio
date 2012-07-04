app.models.Post = Backbone.Model.extend(_.extend({}, app.models.formatDateMixin, {
  urlRoot : "/posts",

  initialize : function() {
    this.interactions = new app.models.Post.Interactions(_.extend({post : this}, this.get("interactions")))
    this.delegateToInteractions()
  },

  delegateToInteractions : function(){
    this.comments = this.interactions.comments
    this.likes = this.interactions.likes

    this.comment = function(){
      this.interactions.comment.apply(this.interactions, arguments)
    }
  },

  setFrameName : function(){
    this.set({frame_name : new app.models.Post.TemplatePicker(this).getFrameName()})
  },

  applicableTemplates: function() {
    return new app.models.Post.TemplatePicker(this).applicableTemplates()
  },

  interactedAt : function() {
    return this.timeOf("interacted_at");
  },

  toggleFavoriteUrl : function(){
    return [this.urlRoot, this.id, "toggle_favorite"].join("/")
  },

  toggleFeaturedUrl : function(){
    return [this.urlRoot, this.id, "toggle_featured"].join("/")
  },

  toggleFavorite : function(options){
    this.set({favorite : !this.get("favorite")})
    /* guard against attempting to save a model that a user doesn't own */
    if(options.save){ this.save({}, { url: this.toggleFavoriteUrl()}) }
  },

  toggleFeatured : function(options){
    this.save({featured : !this.get("featured")}, { url: this.toggleFeaturedUrl()})
  },

  headline : function() {
    if(!this.has('text')){ return '';}
    var headline = this.get("text").trim()
      , newlineIdx = headline.indexOf("\n")
    return (newlineIdx > 0 ) ? headline.substr(0, newlineIdx) : headline
  },

  body : function(){
    var body = this.get("text").trim()
      , newlineIdx = body.indexOf("\n")
    return (newlineIdx > 0 ) ? body.substr(newlineIdx+1, body.length) : ""
  },

  //returns a promise
  preloadOrFetch : function(){
    var action = app.hasPreload("post") ? this.set(app.parsePreload("post")) : this.fetch()
    return $.when(action)
  },

  hasPhotos : function(){
    return this.get("photos") && this.get("photos").length > 0
  },

  showInFeaturedStream : function(){
    return this.get("featured") || this.get("author").id == app.currentUser.id
  },

  hasText : function(){
    return $.trim(this.get("text")) !== ""
  },

  buildRemix : function(){
    return new app.models.StatusMessage(_.clone(this.attributes)).prepareToRemix(this)
  }

}), {
  headlineLimit : 118,

  frameMoods : [
    "Wallpaper",
    "Vanilla",
    "Typist",
    "Fridge"
  ]
});
