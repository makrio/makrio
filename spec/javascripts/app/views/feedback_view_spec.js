describe("app.views.Feedback", function(){
  beforeEach(function(){
   loginAs({id : -1, name: "alice", avatar : {small : "http://avatar.com/photo.jpg"}});

    Diaspora.I18n.loadLocale({stream : {
      'like' : "Like",
      'unlike' : "Unlike",
      'public' : "Public",
      'limited' : "Limited"
    }})

    var posts = $.parseJSON(spec.readFixture("stream_json"));

    this.post = new app.models.Post(posts[0]);
    this.view = new app.views.Feedback({model: this.post});
  });


  describe("triggers", function() {
    it('re-renders when the model triggers feedback', function(){
      spyOn(this.view, "postRenderTemplate")
      this.view.model.interactions.trigger("change")
      expect(this.view.postRenderTemplate).toHaveBeenCalled()
    })
  })

  describe(".render", function(){
    beforeEach(function(){
      this.link = function(){ return this.view.$("a.like"); }
      this.view.render();
    })

    context("likes", function(){
      it("calls 'toggleLike' on the target post", function(){
        loginAs(this.post.get("author"))
        this.view.render();
        spyOn(this.post.interactions, "toggleLike");
        this.link().click();
        expect(this.post.interactions.toggleLike).toHaveBeenCalled();
      })

      context("when the user likes the post", function(){
        it("the like action should have a 'liked' class", function(){
          spyOn(this.post.interactions, "userLike").andReturn(factory.like());
          this.view.render()
          expect(this.link().attr("class")).toContain("liked")
        })
      })

      context("when the user doesn't yet like the post", function(){
        beforeEach(function(){
          this.view.model.set({user_like : null});
          this.view.render();
        })

        it("the like action should not contain 'liked'", function(){
          expect(this.link().attr("class")).toNotContain("liked")
        })
      })
    })

    context("when the post is public", function(){
      beforeEach(function(){
        this.post.attributes.public = true;
        this.view.render();
      })
    })
  })
});

