app.views.ShareView = app.views.Base.extend({
  templateName : 'share',
  events : {
    'click .tweet-button' : 'tweet',
    'click .facebook-button' : 'facebook',
    'click .tumblr-button' : 'tumblr',
    'click .pinterest-button' : 'pinterest',
    'click .imgfave-button' : 'imgfave'
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(),{
      url : this.options.url  || this.url(),
      title : this.model.get('title'),
      screenshotUrl : this.model.get('screenshot_url'),
      hideTumblr : this.options.hideTumblr,
      hidePinterest : this.options.hidePinterest,
      hideUrl: this.options.hideUrl,
      imgfave: true
    })
  },

  initialize : function(options) {
    this.model = options.model
    this.title = options.title
    this.options = options

  },

  url : function() {
    var root = window.location.origin
      , path = this.model.url().replace("posts", "p")

    return root + path
  },

  prepareShare : function(evt){
    evt && evt.preventDefault()
    var link = $(evt.target).parent("a")

    return {
      permalink : encodeURIComponent(link.data('url')),
      title : encodeURIComponent(this.title || link.data('title'))
    }
  },

  tweet : function(evt){
    evt && evt.preventDefault()
    app.instrument("track", "Share", {Service : "Twitter"})

    var shareDetails = this.prepareShare(evt)
      , url = 'https://twitter.com/intent/tweet?text=' + shareDetails.title + "&via=makrioapp" + "&url=" + shareDetails.permalink
    this.launchWindow(url)
  },

  facebook : function(evt){
    evt && evt.preventDefault()
    app.instrument("track", "Share", {Service : "Facebook"})

    var shareDetails = this.prepareShare(evt)
      , url = "https://www.facebook.com/sharer/sharer.php?" +
      "app_id=" + '223055781146202' +
      "&link=" + shareDetails.permalink +
      "&u=" + shareDetails.permalink +
      "&redirect_uri=https://makr.io/done" +
      "&display=popup"

    this.launchWindow(url)
  },

  tumblr : function(evt) {
    evt && evt.preventDefault()
    app.instrument("track", "Share", {Service : "Tumblr"})

    var remixUrl = "https://makr.io/posts/" + this.model.id + "/remix"
      , caption = "made on <a href='https://www.makr.io'>makr.io</a> | <a href='" + remixUrl + "'>remix this</a>"
      , source = this.model.get("screenshot_url")
      , clickThru = "https://makr.io/p/" + this.model.id
      , url = "http://www.tumblr.com/share/photo?" +
        "source=" + encodeURIComponent(source) +
        "&caption=" + encodeURIComponent(caption) +
        "&clickthru=" + encodeURIComponent(clickThru)

    this.launchWindow(url)
  },


  pinterest : function(evt){
    evt && evt.preventDefault()
    app.instrument("track", "Share", {Service : "Pinterest"})

    var url = "https://makr.io/posts/" + this.model.id
      , remixUrl = url + '/remix'
      , media = this.model.get("screenshot_url")
      , description = "made on makr.io https://www.makr.io | remix this " +  remixUrl
      , url = "http://pinterest.com/pin/create/button/?" +
                "url=" + encodeURIComponent(url) + 
                "&media=" + encodeURIComponent(media) +
                "&description" + encodeURIComponent(description)
    this.launchWindow(url)
  },

  imgfave : function(evt){
    evt && evt.preventDefault()
    app.instrument("track", "Share", {Service : "imgfave"})

    //temp hax for now
    if(this.model.get('original')){
      this.model = new app.models.Post(this.model.get('original'))
    }


    var options = {
      source_image : this.model.get('screenshot_url'),
      source_title : this.model.get('title'),
      tags : this.model.get('tag_list'),
      source_url : 'https://makr.io/conversations/' + this.model.get('conversation_id')
    }
    var url = 'http://imgfave.com/post?' + $.param(options)
    this.launchWindow(url, 1000, 900)

  },

  launchWindow : function(url, width, height){
    height = height || 255
    width = width || 600
    window.open(url, 'shareWindow', 'height=' +height + ', width=' + width + ',top='+($(window).height()/2 - 225) +', left='+$(window).width()/2 +', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
  }
});