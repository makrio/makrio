//= require ./small_frame
app.views.Post.FirstCanvasFrame = app.views.Base.extend({
  templateName : 'first-frame',
  className : "mason canvas-frame first-frame",
  events : {
    'click .collection-composer-button' : 'showModalFramer',
    'click a[rel=auth-required]' : 'requireAuth'
  },

  presenter : function(){
    return {
      name : this.currentTag(),
      loggedIn : app.currentUser.authenticated()
    }
  },

  currentTag : function(){
    var path = window.location.pathname
    if(app.isOn(/tagged|topics/)) {
      return window.location.pathname.split('/').pop()
    }
  },
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



  infoView : function() {
    return new app.views.Info({model : this.model})
  },

  postRenderTemplate : function() {
    this.$el.addClass(this.dimensionsClass())
  },

  isNormalizedCollection : function() {
    return this.normalizedCollection || app.isOn("/likes") || app.isOn("/people/") || app.isOn(app.currentUser.get('username'))
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

    /* this logic should be moved into CanvasFrame */
    infoView : function() {
      return new app.views.Info({
        model : this.model,
        hideAuthor : true
      })
    }
});
