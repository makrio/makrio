describe("app.Pages.Stream", function(){
  beforeEach(function(){
    app.setPreload("stream", [factory.post().attributes])
    this.page = new app.pages.Stream()
  });

  describe("the stream model", function(){
    it("populates the collection", function() {
      var post = this.page.model.items.models[0]
      expect(post).toBeTruthy()
    })
  });
});