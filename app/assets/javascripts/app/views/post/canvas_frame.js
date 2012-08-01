//= require ./small_frame
app.views.Post.FirstCanvasFrame = app.views.Base.extend({
  templateName : 'first-frame',
  className : "mason canvas-frame",
  events : {
    'click .collection-composer-button' : 'showModalFramer'
  },

  presenter : function(){
    return {
      name : this.currentTag(),
      loggedIn : app.currentUser.authenticated()
    }
  },

  currentTag : function(){
    return window.location.pathname.split('/').pop()
  },

  onTagPage : function(){
    return window.location.pathname.search('tagged')
  }
});

app.views.Post.CanvasFrame = app.views.Post.SmallFrame.extend({
  SINGLE_COLUMN_WIDTH : 275,
  DOUBLE_COLUMN_WIDTH : 560,

  className : "mason canvas-frame",

  subviews : {
    ".stream-frame-feedback" : "feedbackView",
    ".p-info" : "infoView"
  },

  events : {
    "click .delete" : "killPost",
    "click .content": "showModalPostDetail"
  },

  showModalPostDetail : function(evt){
    evt && evt.preventDefault()
    var postDetail = new app.views.InlinePostDetail({model : this.model})
    this.showModal(postDetail)
  },

  // copy pasta :(
  initialize : function(options) {
    this.stream = options.stream;
    this.composing = options.composing || false;

    this.normalizedCollection = options.normalizedCollection
    this.setScreenshotOrRender()

    // the part that's different than smallFrame
    if(app.onStaffPicks && this.stream && this.stream.items.first() == this.model) {
      this.$el.addClass("x2")
    }
    return this
  },

  infoView : function() {
    if(!this.isNormalizedCollection()) { return }
    return new app.views.Info({model : this.model})
  },

  postRenderTemplate : function() {
    this.$el.addClass(this.dimensionsClass())
  },

  isNormalizedCollection : function() {
    var pathName = document.location.pathname;
    return this.normalizedCollection || pathName.search("/likes") != -1 || pathName.search("/people/") != -1 || pathName.search("/u/") 
  },

  width : function(){
    var modifiers = [this.dimensionsClass(), this.textClasses(), this.$el.attr('class')].join(' ')
    return (modifiers.search("x2") != -1 ? this.DOUBLE_COLUMN_WIDTH : this.SINGLE_COLUMN_WIDTH) 
  },

  adjustedImageHeight : function() {
    return(this.model.adjustedImageHeight(this.width()))
  },

  presenter : function(){
    return _.extend(this.smallFramePresenter(), {
      adjustedImageHeight : this.adjustedImageHeight(),
      adjustedImageWidth : this.width(),
    })
  },

  favoritePost : function(evt) {
    if(evt) {
      /* follow links instead of faving the targeted post */
      if($(evt.target).is('a')) { return }
      evt.stopImmediatePropagation() && evt.preventDefault();
    }

    var prevDimension = this.dimensionsClass();

    this.model.toggleFavorite({save : this.model.get("author").diaspora_id == app.currentUser.get("diaspora_id")})

    this.$el.removeClass(prevDimension)
    this.render()

    app.page.stream.trigger("reLayout")

    // track the action
    app.instrument("track", "Resize Frame")
  },

  killPost : function(){
    this.destroyModel()
    _.defer(function(){app.page.stream.trigger("reLayout")})
  }
});

app.views.Post.BasicScreenshot = app.views.Post.CanvasFrame.extend({
  className : 'canvas-frame gs-frame',

    /* we don't want to carry over any events to this view object */
    events : {},

    infoView : function() {
      return new app.views.Info({
        model : this.model,
        hideAuthor : true
      })
    }
});

