app.views.FacebookFriendFinder = app.views.Base.extend({
  templateName : "facebook-friend-finder",

  initialize : function() {
    this.userConnected = app.currentUser.facebookToken() != ""
  },

  presenter : function(){
    return _.extend(this.defaultPresenter(), {
      facebookToken : app.currentUser.facebookToken(),
      message : encodeURIComponent("Make memes with me on Makr.io!"),
      appId : this.appId(),
      redirectURI: this.redirectURI()
    })
  },

  facebookPopupUrl : function(){
    var p = this.presenter()
    if(this.userConnected){
      return 'https://www.facebook.com/dialog/apprequests?access_token=' + p.facebookToken + '&display=popup&app_id=' + p.appId + '&message=' + p.message + '&redirect_uri=' + p.redirectURI
    } else {
      this.userConnected = true
      return '//' + window.location.host + '/users/auth/facebook'
    }
  },

  redirectURI : function(){
    return 'http://' + window.location.host + '/done'
  },

  appId : function(){
    //if dev domain, return poopies, otherwise makr
    return window.location.host.search('dev') == -1 ? '223055781146202' :'139070652893204'
  }
});
