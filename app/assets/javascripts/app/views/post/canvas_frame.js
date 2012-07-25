//= require ./small_frame

app.views.Post.CanvasFrame = app.views.Post.SmallFrame.extend({
  SINGLE_COLUMN_WIDTH : 265,
  DOUBLE_COLUMN_WIDTH : 560,

  className : "mason canvas-frame",

  subviews : {
    ".stream-frame-feedback" : "feedbackView",
    ".p-info" : "infoView"
  },

  events : {
    "click .content" : "goToOrFavoritePost",
    "click .delete" : "killPost",
    "click .vitals": "showModalPostDetail"
  },

  showModalPostDetail : function(evt){
    evt && evt.preventDefault()
    var postDetail = new app.views.InlinePostDetail({model : this.model})
    this.showModal(postDetail)

  },

  // copy pasta :(
  initialize : function(options) {
    this.stream = options.stream;

    if(app.onStaffPicks && this.stream && this.stream.items.first() == this.model) {
      this.$el.addClass("x2")
    }

    if(this.model.get("show_screenshot")) {
      this.templateName = "small-frame/screenshot"
      this.$el.addClass('frame-screenshot')
    } else {
      this.addStylingClasses()
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
    return pathName.search("/likes") != -1 || pathName.search("/people/") != -1 || pathName.search("/u/")
  },

  adjustedImageHeight : function() {
    if(!(this.model.get("photos") || [])[0]) { return }
    if(this.model.get('frame_name') != 'Wallpaper'){return}

    var modifiers = [this.dimensionsClass(), this.textClasses(), this.$el.attr('class')].join(' ')
      , firstPhoto = this.model.get("photos")[0]
      , width = (modifiers.search("x2") != -1 ? this.DOUBLE_COLUMN_WIDTH : this.SINGLE_COLUMN_WIDTH)
      , ratio = width / firstPhoto.dimensions.width
      , returnValue = ratio * firstPhoto.dimensions.height;

    returnValue = this.model.get("show_screenshot") ? returnValue + 10 : returnValue;

    return(returnValue)
  },

  presenter : function(){
    return _.extend(this.smallFramePresenter(), {
      adjustedImageHeight : this.adjustedImageHeight(),
    })
  },

  goToOrFavoritePost : function() {
    this.isNormalizedCollection() ? this.goToPost() : this.favoritePost()
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
