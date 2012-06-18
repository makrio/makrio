app.views.StreamInteractions = app.views.Base.extend({
  id : "post-info",

  subviews:{
    ".comments" : "comments",
    ".new-comment" : "newCommentView",
    ".love-message" : "loveView",
    ".share-actions" : "shareView"
  },

  templateName : "stream-interactions",

  setInteractions : function (model) {
    model.interactions.fetch().done(
      _.bind(function () {
        this.render()
      }, this));

    this.comments = new app.views.PostViewerReactions({ model: model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : model })
    this.loveView = new app.views.LoveView({ model : model })
    this.shareView = new app.views.ShareView({ model : model })
  }
});

app.views.ShareView = app.views.Base.extend({
  templateName : 'share',
  events : {
    'click .tweet-button' : 'tweet',
    'click .facebook-button' : 'facebook'
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(),{
      url : window.location.origin + '/p/' + this.model.get('id'),
      title : this.model.headline(), 
      screenshotUrl : this.model.get('screenshot_url')
    })
  },

  tweet : function(evt){
    var shareDetails = this.prepareShare(evt)
    var url = 'https://twitter.com/intent/tweet?text=' + shareDetails.title + "&via=makrioapp" + "&url=" + shareDetails.permalink
    this.launchWindow(url)
  },

  prepareShare : function(evt){
    evt.preventDefault();
    var target = $(evt.target)
    var details = {}
    details.permalink = encodeURIComponent(target.attr('href'))
    details.title = encodeURIComponent(target.attr('title'))
    return details
  },

  facebook : function(evt){
    var shareDetails = this.prepareShare(evt)

    var url = "https://www.facebook.com/dialog/feed?" + 
    "app_id=" + '223055781146202' + 
    "&link=" + shareDetails.permalink + 
    "&redirect_uri=https://makr.io/done" +
    "&display=popup"

    this.launchWindow(url)
  },

  launchWindow : function(url){
    window.open(url, 'shareWindow', 'height=255, width=550, top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
  }
});

app.views.LoveView = app.views.Base.extend({
  templateName: 'love',

  events : {
    "click .love-this" : "loveFrame",
    "click .remix-this" : "remixFrame"
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(),{
      userLike : this.model.interactions.userLike(),
    })
  },

  loveFrame : function(evt) {
    if(evt){evt.preventDefault()}
    this.model.interactions.toggleLike({'referrer' : 'give_love_button'})
  },

  remixFrame : function(evt) {
    if(evt){evt.preventDefault()}
    app.router.navigate($(evt.target).attr("href"), {trigger : true})
  }
})
