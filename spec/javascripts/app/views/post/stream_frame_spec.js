describe("app.views.Post.StreamFrame", function(){
  beforeEach(function(){
    this.post = factory.post()
    this.stream = new Backbone.Model
    this.view = new app.views.Post.StreamFrame({model : this.post, stream: this.stream })
  });
});