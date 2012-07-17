app.views.Feedback = app.views.Base.extend({
  templateName: "stream-feedback-actions",

  className : "info",

  events: {
    "click *[rel='auth-required']" : "requireAuth",
    "click .like" : "toggleLike",
    "click .reshare" : "showModalFramer",
    "click .remix" : "showModalFramer",
    "click .modal-comment" : "showModalComments",
    "click .comment" : "comment",
    "click .staff-pick" : "toggleStaffPicked"
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
      userLike : interactions.userLike(),
      canRemove : this.model.canRemove()
    })
  },

  toggleLike: function(evt) {
    evt && evt.preventDefault()
    this.model.interactions.toggleLike({'referrer' : 'icon_with_count'});
  },

  comment : function(evt) {
    evt && evt.preventDefault()
  },

  toggleStaffPicked : function(evt){
    evt && evt.preventDefault()
    if(confirm("u sure you want to staff pick?")){
      this.model.toggleStaffPicked()
    }
  }
});
