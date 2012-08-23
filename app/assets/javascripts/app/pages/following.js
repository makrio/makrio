app.pages.Following = app.pages.Base.extend({
  templateName : 'relationships',

  subviews : {
    "#profile_info" : "profileInfoView"
  },

  initialize : function(opts) {
    this.title = opts && opts.title
    this.model = this.model || app.models.Profile.preloadOrFetch(opts.username)
    this.people = preloads.people

    this.initSubviews()
  },

  initSubviews : function() {
    this.profileInfoView = new app.views.ProfileInfo({
      model : this.model
    })

  },

  postRenderTemplate : function() {
    this.addViews()
  },

  presenter : function() {
    return _.extend(this.defaultPresenter(), {
      title:this.title
    })
  },

  addViews : function() {
    var sortedPeople = _.sortBy(this.people, function(person) { return person.name })

    _.each(sortedPeople, _.bind(function(person) {
      var view = new app.views.PersonListItem({model : new app.models.Profile(person)})
      this.$(".container").append(view.render().el)
    }, this))
  }
});

app.pages.Followers = app.pages.Following;
