//= require ./small_frame

app.views.Post.CanvasFrame = app.views.Post.SmallFrame.extend({
  SINGLE_COLUMN_WIDTH : 265,
  DOUBLE_COLUMN_WIDTH : 560,

  events : {
    "click .info" : "goToPost", // the only event copied from SmallFrame
    "click .content" : "favoritePost",
    "click .delete" : "killPost"
  },

  // copy pasta :(
  initialize : function(options) {
    this.stream = options.stream;

    if(this.model.get("show_screenshot")) {
      this.templateName = "small-frame/screenshot"
      this.$el.addClass('frame-screenshot')
    } else {
      this.addStylingClasses()
    }
  },

  postRenderTemplate : function() {
    this.$el.addClass(this.dimensionsClass())
  },

  adjustedImageHeight : function() {
    if(!(this.model.get("photos") || [])[0]) { return }

    var modifiers = [this.dimensionsClass(), this.textClasses()].join(' ')
      , firstPhoto = this.model.get("photos")[0]
      , width = (modifiers.search("x2") != -1 ? this.DOUBLE_COLUMN_WIDTH : this.SINGLE_COLUMN_WIDTH)
      , ratio = width / firstPhoto.dimensions.width
      , returnValue = ratio * firstPhoto.dimensions.height;

    returnValue = this.model.get("show_screenshot") ? returnValue + 10 : returnValue;

    return(returnValue)
  },

  presenter : function(){
    return _.extend(this.smallFramePresenter(), {
      adjustedImageHeight : this.adjustedImageHeight()
    })
  },

  favoritePost : function(evt) {
    if(evt) {
      /* follow links instead of faving the targeted post */
      if($(evt.target).is('a')) { return }

      evt.stopImmediatePropagation(); evt.preventDefault();
    }

    var prevDimension = this.dimensionsClass();

    this.model.toggleFavorite({save : this.model.get("author").diaspora_id == app.currentUser.get("diaspora_id")})

    this.$el.removeClass(prevDimension)
    this.render()

    app.page.stream.trigger("reLayout")
    //trigger moar relayouts in the case of images WHOA GROSS HAX
    _.delay(function(){app.page.stream.trigger("reLayout")}, 200)

    // track the action
    app.instrument("track", "Resize Frame")
  },

  killPost : function(){
    this.destroyModel()
    _.delay(function(){app.page.stream.trigger("reLayout")}, 0)
  }
});
