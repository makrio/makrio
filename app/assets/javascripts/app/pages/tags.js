app.pages.TagsShow = app.pages.GenericCanvas.extend({
  templateName : 'tags-show',
  subviews : {
    "#canvas" : "canvasView",
    '#tag-info' : 'tagInfo',
    '#new_posts_notifier' : 'newPostsView'
  },

  initialize : function(options){
    this.tagName = options.name
    this.tagInfo = new app.views.TagInfo({name : this.tagName})

    this.setUpInfiniteScroll({poller: true})
    this.initSubviews()
  },

  presenter : function(){
    return {name : this.tagName}
  }
});

app.views.TagInfo = app.views.Base.extend({
  templateName : 'tag-info',

  subviews : {
    '#share_actions' : 'shareView'
  },
  events : {
    "click #collection-composer-button" : 'showModalFramer'
  },

  tooltipSelector : ".leader a",

  initialize : function(options){
    this.tagName = options.name

    this.model = new app.models.Tag({name : this.tagName})
    this.shareView = new app.views.ShareView({model: this.model, hidePinterest: true, hideTumblr: true, hideUrl:true, url: 'https://makr.io/tagged/' + this.tagName})

    var self = this
    this.model.fetch().done(function(){

      self.render()
    })
  }
});