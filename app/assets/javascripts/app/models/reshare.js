app.models.Reshare = app.models.Post.extend({
  urlRoot : "/reshares",

  parentPost : function(){
    this._parentPost = this._parentPost || new app.models.Post(this.get("parent"));
    return this._parentPost
  },

  reshare : function(){
    return this.parentPost().reshare()
  },

  reshareAuthor : function(){
    return this.parentPost().reshareAuthor()
  }
});
