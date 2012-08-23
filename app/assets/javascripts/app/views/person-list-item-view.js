app.views.PersonListItem = app.views.Base.extend({
  templateName : 'person-list-item',
  className: 'row',

  subviews : {
    ".follow-btn" : "followButtonView"
  },

  initialize : function() {
    this.initViews()
  },

  initViews : function() {
    this.followButtonView = new app.views.FollowButton({model : this.model})
  },

  unbind : function() {
    this.followButtonView.unbind()
  }
});
