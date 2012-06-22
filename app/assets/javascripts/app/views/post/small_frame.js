//= require "../post_view"

app.views.Post.SmallFrame = app.views.Post.extend({
  className : "canvas-frame",

  templateName : "small-frame/default",  // default to fall back to

  events : {
    "click .info" : "goToPost"
  },

  subviews : {
    '.embed-frame' : "oEmbedView"
  },

  initialize : function(options) {
    this.stream = options.stream;
    this.addStylingClasses()
  },

  oEmbedView : function(){
    return new app.views.OEmbed({model : this.model})
  },

  smallFramePresenter : function(){
    //todo : we need to have something better for small frame text, probably using the headline() scenario.
    return _.extend(this.defaultPresenter(),
      {
        text : this.model && app.helpers.textFormatter(this.model.get("text"), this.model),
        likesCount : this.model.interactions.likesCount(),
        resharesCount : this.model.interactions.resharesCount(),
        commentsCount : this.model.interactions.commentsCount()
      })
  },

  postRenderTemplate : function() {
    this.addStylingClasses()

    if(this.model.get("frame_name") == "Fridge") {
      this.$("img").vintage();
    }
  },

  addStylingClasses : function() {
    this.$el.addClass([this.dimensionsClass(), this.colorClass(), this.frameClass()].join(' '))
  },

  frameClass : function(){
    var name = this.model.get("frame_name") || ""
    return name.toLowerCase()
  },

  colorClass : function() {
    var text = this.model.get("text")
      , baseClass = $.trim(text).length == 0 ? "no-text" : "has-text"
      , textClass;

    if(this.model.get("photos").length > 0 || this.model.get("o_embed_cache"))
      baseClass += " has-media";

    if(baseClass == "no-text" || this.model.get("photos").length > 0 || this.model.get("o_embed_cache")) { return baseClass }

    if(baseClass.search("no-text") != -1 || text.length < 40) {
      textClass += " big-text"
    }

    return [baseClass, textClass].join(" ")
  },

  dimensionsClass : function() {
    return (this.model.get("favorite")) ?  "x2 width height" : ""
  },

  goToPost : function(evt) {
    if(evt) { evt.preventDefault() && evt.stopImmediatePropagation(); }
    app.setPreload('post',this.model.attributes)
    app.router.navigate(this.model.url(), true)
  }
});
