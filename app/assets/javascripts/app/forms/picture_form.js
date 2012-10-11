app.forms.PictureBase = app.views.Base.extend({
  events : {
    "change input[name='photo[user_file]']" : "submitUpload",
    "click .img-url" : "submitURL"
  },


  postRenderTemplate : function(){
    this.$("input[name=authenticity_token]").val($("meta[name=csrf-token]").attr("content"))
  },

  submitUpload : function (evt){
    this.requireAuth(); //the file picker thing doesnt allow for normal binding of this.
    var that = this
    var fileinput = evt.target

    if(!(fileinput.files[0].type.indexOf("image/") === 0)){
      return false
    }

    filepicker.setKey('7nluBwH4SbyxSKdCamQD');
    this.onSubmit();

    filepicker.uploadFile(evt.target, function(data){
      $(fileinput).val('')// need to clear out the field so we do not double submit
      var filename = data.url + '+' + data.data.filename
      that.addPhoto(filename)
    });
  },

  submitURL : function(evt){
    evt && evt.preventDefault()
    var filename = this.$("form input[name='photo[image_url]']").val()
    if(filename){
      this.onSubmit();
      this.addPhoto(filename)
    } 
  },
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

  addPhoto : function(url){
    var newPhoto = new app.models.Photo()
    newPhoto.prepareForFramer(url)

    newPhoto.save().done(_.bind(function(){
      var photos = _.clone(this.model.photos)
      this.photos = photos.add(newPhoto)
      this.trigger("uploaded")
    }, this))
  }
});

/* wallpaper uploader */
app.forms.Wallpaper = app.forms.PictureBase.extend({
  templateName : "wallpaper-form",

  uploadSuccess : function(resp) {
    $("#profile").css("background-image", "url(" + resp.data.wallpaper + ")")
  }
});