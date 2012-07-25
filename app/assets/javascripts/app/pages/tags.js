app.pages.TagsShow = app.pages.GenericCanvas.extend({
  templateName : 'tags-show',
  subviews : {
    "#canvas" : "canvasView",
    "header" : "headerView",
    "#user_pane" : "userPaneView",
    '#tag-info' : 'tagInfo'
  },

  initialize : function(options){
    this.tagName = options.name
    this.setUpInfiniteScroll()
    this.tagInfo = new app.views.TagInfo({name : this.tagName})
  },

  presenter : function(){
    return {name : this.tagName}
  }
});

app.views.TagInfo = app.views.Base.extend({
  templateName : 'tag-info',
  events : {
    "click #collection-composer-button" : 'showModalFramer'
  },

  initialize : function(options){
    this.tagName = options.name

    this.model = new app.models.Tag({name : this.tagName})

    var self = this
    this.model.fetch().done(function(){
      self.render()
    })
  }
});