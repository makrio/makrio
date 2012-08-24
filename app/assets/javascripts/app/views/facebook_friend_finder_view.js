app.views.FacebookFriendFinder = app.views.Base.extend({
  templateName : "facebook-friend-finder",

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      facebookToken : app.currentUser.facebookToken(),
      message : encodeURIComponent("Make memes with me on Makr.io!"),
      appId : this.appId(),
      redirectURI: this.redirectURI()
    })
  },

  redirectURI : function(){
    return 'http://' + window.location.host + '/facebook_friend_finder'
  },

  appId : function(){
    //if dev domain, return poopies, otherwise makr
    return window.location.host.search('dev') == -1 ? '223055781146202' :'139070652893204'
  }

});