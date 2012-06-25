describe("app.models.Reshare", function(){
   beforeEach(function(){
     this.reshare = new app.models.Reshare({parent: {a:"namaste", be : "aloha", see : "community"}})
   });

   describe("parentPost", function(){
     it("should be the parent attrs", function(){
       expect(this.reshare.parentPost().get("be")).toBe("aloha")
     });

     it("should return a post", function(){
       expect(this.reshare.parentPost() instanceof app.models.Post).toBeTruthy()
     });

     it("does not create a new object every time", function(){
       expect(this.reshare.parentPost()).toBe(this.reshare.parentPost())
     });
   });

   describe(".reshare", function(){
     it("reshares the parent post", function(){
       spyOn(this.reshare.parentPost(), "reshare")
       this.reshare.reshare()
       expect(this.reshare.parentPost().reshare).toHaveBeenCalled()
     });
     
     it("returns something", function() {
      expect(this.reshare.reshare()).toBeDefined();
     });
   });
});

