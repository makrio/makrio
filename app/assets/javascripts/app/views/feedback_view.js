app.views.Feedback = app.views.Base.extend({
  templateName: "feedback",

  className : "info",

  events: {
    "click *[rel='auth-required']" : "requireAuth",
    "click .like" : "toggleLike",
    "click .reshare" : "resharePost",
    "click .comment" : "comment"
  },

  tooltipSelector : ".label",

  initialize : function() {
    this.model.interactions.on('change', this.render, this);
    this.initViews && this.initViews() // I don't know why this was failing with $.noop... :(
  },

  presenter : function() {
    var interactions = this.model.interactions

    return _.extend(this.defaultPresenter(),{
      commentsCount : interactions.commentsCount(),
      likesCount : interactions.likesCount(),
      resharesCount : interactions.resharesCount(),
      userCanReshare : interactions.userCanReshare(),
      userLike : interactions.userLike(),
      userReshare : interactions.userReshare()
    })
  },

  toggleLike: function(evt) {
    if(evt) { evt.preventDefault(); }
    this.model.interactions.toggleLike({'referrer' : 'icon_with_count'});
  },

  resharePost : function(evt) {
    if(evt) { evt.preventDefault(); }
    app.router.navigate(this.model.url() + '/remix', {trigger : true})
  },

  comment : function(evt) {
    /* temp hacks */
    if(evt) { evt.preventDefault(); }
  },

  requireAuth : function(evt) {
    if( app.currentUser.authenticated() ) { return }
    alert("you must be logged in to do that!")
    return false;
  }
});
