app.views.Feedback = app.views.Base.extend({
  templateName: "feedback",

  className : "info",

  events: {
    "click *[rel='auth-required']" : "requireAuth",
    "click .like" : "toggleLike",
    "click .reshare" : "remixPost",
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
      remixCount : interactions.remixCount(),
      userLike : interactions.userLike()
    })
  },

  toggleLike: function(evt) {
    if(evt) { evt.preventDefault(); }
    this.model.interactions.toggleLike({'referrer' : 'icon_with_count'});
  },

  remixPost : function(evt) {
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
