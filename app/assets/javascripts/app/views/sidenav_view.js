app.views.SideNav = app.views.Base.extend({
  templateName: "sidenav",

  events : {
    'click .find-friends' : 'showModalFacebookFriendFinder'
  },

  initialize : function() {
    this.facebookFriendFinderView = new app.views.FacebookFriendFinder()
  },

  presenter : function() {
    return {
      profileURL : app.currentUser.url(),
      onFeed : app.isOn('feed')
    }
  },

});
