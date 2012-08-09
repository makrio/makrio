app.models.Photo = Backbone.Model.extend(_.extend({}, app.models.formatDateMixin, {
  urlRoot : "/photos",

  initialize : function() {},

  prepareForFramer : function(url){
    var  hash = {
      photo : {
              image_url : url
              },
      sizes : { 
          large: url,
          medium: url, 
          small: url,
      }
    }

    this.set(hash)
  }

}));
