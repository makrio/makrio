//require ../post

app.models.Post.TemplatePicker = function(model){
  this.model = model
}

_.extend(app.models.Post.TemplatePicker.prototype, {
  getFrameName : function(){ 
    return "Wallpaper"
  },

  applicableTemplates : function(){
    return app.models.Post.frameMoods
  }
});