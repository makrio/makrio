app.forms.PictureBase = app.views.Base.extend({
  events : {
    'ajax:complete .new_photo' : "photoUploaded",
    "change input[name='photo[user_file]']" : "submitForm"
  },

  onSubmit : $.noop,
  uploadSuccess : $.noop,

  postRenderTemplate : function(){
    this.$("input[name=authenticity_token]").val($("meta[name=csrf-token]").attr("content"))
  },

  submitForm : function (){
    this.$("form").submit();
    this.onSubmit();
  },

  photoUploaded : function(evt, xhr) {
    resp = JSON.parse(xhr.responseText)
    if(resp.success) {
      this.uploadSuccess(resp)
    } else {
      alert("Upload failed!  Please try again. " + resp.error);
    }
  }
});

/* multi photo uploader */
app.forms.Picture = app.forms.PictureBase.extend({
  templateName : "picture-form",

  initialize : function() {
    this.photos = this.model.photos || new Backbone.Collection()
    this.photos.bind("add", this.render, this)
  },

  postRenderTemplate : function(){
    this.$("input[name=authenticity_token]").val($("meta[name=csrf-token]").attr("content"))
  },

  onSubmit : function (){
    this.$(".photos").append($('<span class="loader" style="margin-left: 80px;"></span>'))
  },

  uploadSuccess : function(resp) {
    this.photos.add(new Backbone.Model(resp.data))
    this.trigger("uploaded")
  }
});

/* wallpaper uploader */
app.forms.Wallpaper = app.forms.PictureBase.extend({
  templateName : "wallpaper-form",

  uploadSuccess : function(resp) {
    $("#profile").css("background-image", "url(" + resp.data.wallpaper + ")")
  }
});