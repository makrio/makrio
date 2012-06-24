//= require ../views/post/small_frame

app.pages.Framer = app.views.Base.extend({
  templateName : "flow",

  id : "post-content",

  subviews : {
    ".flow-content" : "framerContent",
    ".flow-controls .controls" : "framerControls"
  },

  initialize : function(){
    this.model = this.model || new app.models.StatusMessage
    this.model.photos = this.model.photos || new Backbone.Collection()

    if(!this.model.get("frame_name")) this.model.setFrameName()

    this.model.authorIsCurrentUser = function(){ return true }
    this.model.bind("sync", this.navigateNext, this)

    this.framerContent = new app.views.framerContent({model : this.model})
    this.framerControls = new app.views.framerControls({model : this.model})
  },

  unbind : function(){
    this.model.off()
  },

  navigateNext : function(){
    if(opener) {
      app.router.navigate('/framer/done/' + this.model.get('id'), {trigger: true})
    } else {
      this.defaultNavigation()
    }
  },

  bookmarkletNavigation : function() {
    parent.close()
  },

  defaultNavigation : function() {
    // app.router.navigate(url, {trigger: true, replace: true})
    app.router.setLocation('/stream')
  }
});

app.views.framerContent = app.views.Base.extend({
  templateName : "framer-content",

  events : {
    "change input" : "setFormAttrs"
  },

  subviews : {
    ".preview" : "smallFrameView",
    ".photo-upload" : 'photoForm'
  },

  formAttrs : {
    "input.mood:checked" : "frame_name"
  },

  initialize : function(){
    // we need to memoize the photo form here
    this.photoForm = new app.forms.Picture({
      model : this.model
    })
    this.photoForm.templateName = 'framer-photo-uploader'

    this.model.bind("change:frame_name", this.render, this)
    this.model.bind("change:photos", this.resetFrame, this)

    this.photoForm.bind("uploaded", this.setPhotosFromForm, this)
  },

  setPhotosFromForm : function() {
    this.model.photos = this.photoForm.photos
    this.model.set({"photos": this.model.photos.toJSON()})

    this.resetFrame()
  },

  resetFrame : function() {
    this.model.unset("frame_name") && this.model.setFrameName()
  },

  smallFrameView : function() {
    return new app.views.Post.EditableSmallFrame({
      model : this.model, className : 'canvas-frame x2 height width'
    })
  },

  presenter : function() {
    var selectedFrame = this.model.get("frame_name")
      , templates = this.model.applicableTemplates();

    return _.extend(this.defaultPresenter(), {
      templates : _.map(templates, function(template) {
        return {
          name : template,
          checked : selectedFrame === template
        }
      })
    })
  }
});

app.views.Post.EditableSmallFrame = app.views.Post.SmallFrame.extend({
  className : "canvas-frame editable",

  events : {
    "keyup [contentEditable]" : "setState",
    "click .remove-image" : "removeImage"
  },

  setState : function(evt) {
    this.setFormAttrs()

    if(this.model.get("frame_name") == "Wallpaper" ) {
      if( !this.model.hasText(evt) ) {
        this.$el.removeClass('has-text')
          .addClass('no-text')
      } else {
        this.$el.removeClass('no-text')
          .addClass('has-text')
      }
    }
  },

  formAttrs : {
    ".text-content p" : "text"
  },

  removeImage : function(evt) {
    var imageId = $(evt.target).data('image-id')
      , filteredPhotos = _.filter(this.model.get("photos"), function(item) {
        return item.id !== imageId
      });

    this.model.set("photos", filteredPhotos)
    this.model.photos = new Backbone.Collection(filteredPhotos)
  },

  postRenderTemplate : function(){
    var editable = this.$(".text-content p")
    editable.attr("contentEditable", true)
    if(!editable.text()){editable.html("&nbsp")} //needed so hover state so blue shows up, and for cukes

    // if(this.model.get("frame_name") == "Fridge") {
    //   this.$("img").vintage();
    // }
  }
});

app.views.framerControls = app.views.Base.extend({
  templateName : 'framer-controls',

  events : {
    "click input.done" : "saveFrame",
    "change input" : "setFormAttrs"
  },

  subviews:{
    ".aspect-selector" : "aspectsDropdown",
    ".service-selector" : "servicesSelector"
  },

  formAttrs : {
    "input.services" : "services[]"
  },

  initialize : function(){
    this.aspectsDropdown = new app.views.AspectsDropdown({model:this.model});
    this.servicesSelector = new app.views.ServicesSelector({model:this.model});
  },

  saveFrame : function(){
    this.setFormAttrs()
    this.model.set({"aspect_ids": ["public"]})
    if(this.inValidFrame()) {
      return false;
    } 
    this.$('input').prop('disabled', 'disabled')


    this.model.save()

    this.trackPost()
  },

  trackPost : function() {
    var model = this.model

    app.instrument("track", "Posted", {
      text : model.hasText(),
      photos : model.hasPhotos(),
      template : model.get("frame_name")
    })
  },

  inValidFrame : function(){
    return (this.model.get('text').trim().length == 0)  && (this.model.get('photos').length == 0)
  }
});
