describe("app.pages.Profile", function(){
  beforeEach(function(){
    this.guid = 'abcdefg123'
    this.profile = factory.profile({personId: this.guid})
    this.profile.deferred = new $.Deferred()
    spyOn(app.collections.Posts.prototype, "fetch").andReturn(new $.Deferred)
    app.page = this.page = new app.pages.Profile({model : this.profile });
    this.stream = this.page.stream
    this.profile.deferred.resolve()
  });

  it("fetches the profile of the user with the params from the router and assigns it as the model", function(){
    var profile = new factory.profile()
    profile.deferred = $.Deferred()
    spyOn(app.models.Profile, 'findByGuid').andReturn(profile)
    var page =  new app.pages.Profile({personId : 'jarjabinkisthebest' })
    expect(app.models.Profile.findByGuid).toHaveBeenCalledWith('jarjabinkisthebest')
    expect(page.model).toBe(profile)
  })

  it("passes the stream down to the canvas view", function(){
    expect(this.page.canvasView.model).toBeDefined()
    expect(this.page.canvasView.model).toBe(this.stream)
  });

  it("preloads the stream for the user", function(){
    spyOn(this.stream, "preload")

    window.preloads = {stream : JSON.stringify(["unicorns"]) }

    new app.pages.Profile({stream : this.stream})
    expect(this.stream.preload).toHaveBeenCalled()

    delete window.preloads //cleanup
  })

  describe("rendering", function(){
    describe("with no posts", function(){
      beforeEach(function(){
        this.profile.set({"name" : "Alice Waters", person_id : "889"})
        this.stream.deferred.resolve()
      })

      it("has a message that there are no posts", function(){
        this.page.render()
        expect(this.page.$("#canvas").text()).toBe("Alice Waters hasn't posted anything yet.")
      })

      it("tells you to post something if it's your profile", function(){
        this.profile.set({is_own_profile : true})
        this.page.render()
        expect(this.page.$("#canvas").text()).toBe("Make something to start the magic.")
      })
    })

    describe("with a post", function(){
      beforeEach(function(){
        loginAs({name: "alice"})
        this.post = factory.post()
        this.stream.add(this.post)
        this.stream.deferred.resolve()
        this.page.render()
      });

      describe("clicking fav", function(){
        beforeEach(function(){
          spyOn(this.post, 'toggleFavorite')
          spyOn($.fn, "isotope")
          //this.page.$(".content").click() //stub this out for now
        })

        it("relayouts the page", function(){
          expect($.fn.isotope).toHaveBeenCalledWith("reLayout")
        })

        it("toggles the favorite status on the model", function(){
          expect(this.post.toggleFavorite).toHaveBeenCalled()
        })
      })

      describe("clicking delete", function(){
        beforeEach(function () {
          spyOn(window, "confirm").andReturn(true);
          this.page.render()
        })

        it("kills the model", function(){
          spyOn(this.post, "destroy")
          this.page.$(".canvas-frame:first a.delete").click()
          expect(this.post.destroy).toHaveBeenCalled()
        })

        it("removes the frame", function(){
          spyOn($.fn, "remove").andCallThrough()
          expect(this.page.$(".canvas-frame").length).toBe(1)
          this.page.$(".canvas-frame:first a.delete").click()
          waitsFor(function(){ return $.fn.remove.wasCalled })
          runs(function(){ expect(this.page.$(".canvas-frame").length).toBe(0) })
        })
      })
    })
  });
});
