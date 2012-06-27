app.views.StreamInteractions = app.views.Base.extend({
  id : "post-info",

  subviews:{
    ".comments" : "comments",
    ".new-comment" : "newCommentView",
    ".share-actions" : "shareView"
  },

  templateName : "stream-interactions",

  setInteractions : function (model) {
    var self = this;
    this.model = model

    this.cleanupOldviews()

    this.comments = new app.views.PostViewerReactions({ model: model.interactions })
    this.newCommentView = new app.views.PostViewerNewComment({ model : model })
    this.shareView = new app.views.ShareView({ model : model })

    _.defer(_.bind(this.render, this))
    _.delay(function(){
        var modelStillSelected = model.id && $(".stream-frame .active").data("id") == model.id
        if(modelStillSelected){
          model.interactions.fetch().done(function(){
            self.render()
          });
        }
      }, 1000
    )
  },

  cleanupOldviews : function(){
    this.comments && this.comments.unbind()
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
      title : this.model.get('title'), 
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
