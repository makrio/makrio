app.Router = Backbone.Router.extend({
  routes: {
    "" : "rootPage",

    //explore sub-sections
    "latest": "newStream",
    "feed": "feed",

    "front_page": "frontPage",
    "interests": "interests",

    "staff_picks": "staffPicks",

    "top_tags" : 'topTags',
    "topics" : 'topTags',

    'tagged/:name' : 'tagShow',
    'topics/:name' : 'tagShow',
    //end explore sub-sections

    'timewarp' : 'timewarp',
    'timewarp/:days_ago' : 'timewarp',
    'timewarp' : 'timewarp',

    "search/:query": "search",

    "people/:id": "newProfile",
    "u/:name": "newProfile",

    "likes": "likes",

    "posts/:id/remix" : 'remix',
    "posts/new" : "redirectToFramer",

    "framer": "framer",
    "framer/done/:id" : "doneFraming",

    "posts/:id": "singlePost",
    "posts/:id/frame": "singlePostFrame",
    "posts/:id/styleguide": "styleGuide",
    "p/:id": "singlePost",

    "posts/:id/next": "siblingPost",
    "posts/:id/previous": "siblingPost",

    "conversations/:id" : "conversation",
    "conversations": "conversations",
    
    'about' : 'about',
    'pro_tips' : 'proTips',
    'getting_started' : 'gettingStarted',

    ':name/following' : 'following',
    ':name/followers' : 'followers',
    ":name" : "newProfile"
  },

  following : function(username){
    this.renderPage(function(){
      return new app.pages.Following({
        title:"Following",
        username:username
      })
    });
  },

  followers : function(username){
    this.renderPage(function(){
      return new app.pages.Following({
        title: "Followers",
        username:username
      })
    });
  },

  redirectToFramer : function(){
    app.router.navigate("/framer", true)
  },

  about : function(){
    this.renderPage(function(){ return new app.pages.About()});
  },

  proTips : function(){
    this.renderPage(function(){ return new app.pages.ProTips()});
  },

  gettingStarted : function(){
    this.renderPage(function(){ return new app.pages.GettingStarted()});
  },
  
  interests : function(){
    app.instrument("track", "Track Interests")

    this.genericCanvas({
      title:'Interests',
      description: "personalized just for you",
      you: true
    })
  },

  timewarp : function(daysAgo){
    var daysAgo = daysAgo || {}
    var days = typeof(daysAgo) =='String' ? daysAgo : daysAgo.days_ago
    this.renderPage(function(){
      return new app.pages.TimeWarp({
        daysAgo: days,
        explore: true
      })});
  },

  topTags : function(){
    app.instrument("track", "Top Tags Loaded")
    this.renderPage(function(){
      return new app.pages.TopTags({
        explore: true
      })
    });
  },

  styleGuide : function(id){
    var model = new app.models.Post({ id : id })
      , self = this;

    model.preloadOrFetch()
      .done(function(resp){
        self.renderPage(function(){ return new app.pages.StyleGuide({model: resp}) })
      })
  },

  conversations : function(){
    app.instrument("track", "Conversations index loaded")
    this.renderPage(function(){ return new app.pages.ConversationsIndex()});
  },

  conversation : function() {
    app.instrument("track", "Conversation loaded")
    this.renderPage(function(){ return new app.pages.Conversations()});
  },

  likes : function() {
    app.instrument("track", "Likes loaded")

    this.genericCanvas({
      title : "My Likes",
      you: true
    })
  },

  rootPage : function() {
    this.frontPage()
  },

  genericCanvas : function(options){
    this.renderPage(function(){
      return new app.pages.GenericCanvas(options)
    })
  },

  staffPicks : function() {
    this.genericCanvas({
      title : "Staff Picks"
    })
  },

  frontPage : function() {
    app.instrument("track", "Front Page loaded")
    this.genericCanvas({
      title: "Popular",
      description: "Recently popular posts",
      explore: true
    })
  },

  feed : function() {
    app.instrument("track", "Feed loaded")
    var opts = {you:true}

    var wantsCanvas = window.location.search.search('canvas') != -1
      , page = wantsCanvas ? new app.pages.GenericCanvas(opts) : new app.pages.Stream(_.extend(opts, {onStream:true}))
    
    this.renderPage(function(){ return page});
  },

  newStream : function() {
    app.instrument("track", "Stream loaded")
    var opts = {explore:true}

    var wantsCanvas = window.location.search.search('canvas') != -1
      , page = wantsCanvas ? new app.pages.GenericCanvas(opts) : new app.pages.Stream(_.extend(opts, {onStream:true}))
    
    this.renderPage(function(){ return page});
  },

  search : function(){
    this.renderPage(function(){ return new app.pages.Search()});
  },

  remix : function(id){
    var remixed = new app.models.StatusMessage({id : id})
    remixed.fetch().success(_.bind(function(){
      var new_mix = remixed.buildRemix()

      this.renderPage(function(){ return new app.pages.Framer({model : new_mix })});
    }, this)).fail(function(){alert('There was an error loading the Remix. Please Try Refreshing.')});
  },

  newProfile : function(username) {
    this.renderPage(function(){
      return new app.pages.Profile({
        username: username
      })
    });
  },

  doneFraming : function(id){
    var model = new app.models.Post({ id : id })
      , self = this;

    model.preloadOrFetch().done(function(resp){
      self.renderPage(function(){ return new app.pages.DoneFraming({ model: resp})});
    })
  },

  framer : function(params){
    app.instrument("track", "Compose")

    // bookmarklet
    if(params && params.bookmarklet && params.remoteurl) {
      app.remotePhotoUrl = decodeURIComponent(params.remoteurl)
    }

    this.renderPage(function(){ return new app.pages.Framer()});
  },

  singlePost : function(id) {
    this.renderPage(function(){ return new app.pages.PostViewer({ id: id })});
  },

  singlePostFrame : function(id) {
    var model = new app.models.Post({ id : id })
      , self = this;

    model.preloadOrFetch()
      .done(function(resp){
        self.renderPage(function(){ return new app.pages.SinglePostFrame({model: resp}) })
      })
  },
  
  siblingPost : function(){ //next or previous
    var post = new app.models.Post();
    post.bind("change", setPreloadAttributesAndNavigate)
    post.fetch({url : window.location})

    function setPreloadAttributesAndNavigate(){
      window.preloads.post = post.attributes
      app.router.navigate(post.url(), {trigger:true, replace: true})
    }
  },

  renderPage : function(pageConstructor){
    app.page && app.page.unbind() //old page might mutate global events $(document).keypress, so unbind before creating
    app.page = pageConstructor() //create new page after the world is clean (like that will ever happen)
    $("#container").html(app.page.render().el)
    $(window).scrollTop(0)
  },

  setLocation : function(location){
    //I made this so we can stub it out nicely
    window.location = location
  },

  tagShow : function(name, params){
    this.trackCampaign(params)
    app.instrument("track", "Topic Loaded", {
      Name : name
    })
    this.renderPage(function(){
      return new app.pages.TagsShow({
        name : name,
        explore: true
      })
    });
  },
  
  category : function(name){
    this.genericCanvas();
  },

  trackCampaign : function(params) {
    var campaign = (params && params.campaign)
    if(campaign) {
      app.instrument("track", "Campaign", {
        Name : campaign
      })
    }
  }
});
