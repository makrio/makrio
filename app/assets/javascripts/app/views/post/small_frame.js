//= require "../post_view"

app.views.Post.SmallFrame = app.views.Post.extend({
  className : "canvas-frame",

  templateName : "small-frame/default",  // default to fall back to

  subviews : {
    '.embed-frame' : "oEmbedView",
    ".stream-frame-feedback" : "feedbackView"
  },

  events : {
    'click .video-overlay' : 'reRenderWithoutScreenshot' //this should be gif overlay
  },

  initialize : function(options) {
    this.stream = options.stream;
    this.composing = options.composing || false;
    this.normalizedCollection = options.normalizedCollection

    //show screenshot should now be has_screenshot
    this.setScreenshotOrRender()
  },

  setScreenshotOrRender : function() {
    if(this.model.get("show_screenshot") && !this.composing) { 
      this.templateName = "small-frame/screenshot"
      this.$el.addClass('frame-screenshot')
    } else {
      this.addStylingClasses()
    }
  },

  reRenderWithoutScreenshot : function(){
    this.$el.height(this.$el.height())
    this.templateName = "small-frame/default"
    this.composing = true
    this.addStylingClasses()
    this.$el.removeClass('frame-screenshot')
    this.render()
  },

  isNormalizedCollection : function() {
    return false;
  },

  oEmbedView : function(){
    return new app.views.OEmbed({model : this.model})
  },

  feedbackView : function() {
    return new app.views.StreamFeedbackActions({ model: this.model })
  },

  smallFramePresenter : function(){
    //todo : we need to have something better for small frame text, probably using the headline() scenario.
    return _.extend(this.defaultPresenter(),
      {
        text : this.model && app.helpers.textFormatter(this.model.get("text"), this.model),
        likesCount : this.model.interactions.likesCount(),
        commentsCount : this.model.interactions.commentsCount(),
        adjustedImageHeight : this.model.adjustedImageHeight(500),
        adjustedImageWidth: 500
      })
  },

  presenter : function(){
    return this.smallFramePresenter()
  },

  postRenderTemplate : function() {
    if(!!this.model.get("show_screenshot") && !this.composing) { return; }
    this.addStylingClasses()
  },

  addStylingClasses : function() {
    this.$el.addClass([this.dimensionsClass(), this.textClasses(), this.frameClass()].join(' '))
  },

  frameClass : function(){
    var name = this.model.get("frame_name") || ""
    return name.toLowerCase()
  },

  textClasses : function() {
    var text = this.model.get("text")
      , hasText = $.trim(text).length == 0 ? "no-text" : "has-text"
      , hasMedia = hasMediaObject(this.model) ? "has-media" : ""
      , baseClass = (hasMedia.length == 0 && text.length < 40) ? "big-text" : "";

    return [baseClass, hasText, hasMedia].join(" ")

    function hasMediaObject(model){
      return (model.get("photos").length > 0 || model.get("o_embed_cache"))
    }
  },

  dimensionsClass : function() {
    if(app.onStaffPicks()) return;
    return (!this.normalizedCollection && this.model.interactions.get("likes_count") >= 10) ? "x2" : ""
  },

  goToPost : function(evt) {
    if(evt) { evt.preventDefault() && evt.stopImmediatePropagation(); }
    app.setPreload('post',this.model.attributes)
    app.router.navigate('/p/' + this.model.id, true)
  }
});
