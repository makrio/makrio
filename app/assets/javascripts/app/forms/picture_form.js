app.forms.PictureBase = app.views.Base.extend({
  events : {
    'ajax:complete .new_photo' : "photoUploaded",
    "change input[name='photo[user_file]']" : "submitUpload",
    // 'click #photo_upload_button' : 'invokeFilePicker',
    "click .img-url" : "submitURL"
  },

  onSubmit : $.noop,
  uploadSuccess : $.noop,

  // invokeFilePicker : function(){
  //   filepicker.setKey('7nluBwH4SbyxSKdCamQD');
    
  //   var self = this;
  //   filepicker.getFile('image/*', {'modal' : true, 'services': ['My Computer', 'Images', 'Webcam']}, function(url, metadata) {
  //     self.$("form input[name='photo[image_url]']").val(url + '+' + metadata.filename)
  //     self.submitURL()
  //   })
  // },

  postRenderTemplate : function(){
    this.$("input[name=authenticity_token]").val($("meta[name=csrf-token]").attr("content"))
  },

  submitUpload : function (){
    this.$("form").submit();
    this.onSubmit();
  },

  submitURL : function(){
    if(this.$("form input[name='photo[image_url]']").val()){
      this.submitUpload();
    } 
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
    if(this.photos.length == 0 && app.remotePhotoUrl){
      this.$("form input[name='photo[image_url]']").val(app.remotePhotoUrl)
      _.defer(_.bind(this.submitURL, this));
    }
  },

  onSubmit : function (){
    this.$(".new_photo").append($('<span class="loader" style="margin-left: 5px;"></span>'))
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