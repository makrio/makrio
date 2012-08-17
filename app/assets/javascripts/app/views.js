app.views.Base = Backbone.View.extend({
  initialize : function() {
    this.setupRenderEvents();
  },

  presenter : function(){
    return this.defaultPresenter()
  },

  setupRenderEvents : function(){
    if(this.model) {
      //this should be in streamobjects view
      this.model.bind('remove', this.remove, this);
    }
  },

  defaultPresenter : function(){
    var modelJson = this.model && this.model.attributes ? _.clone(this.model.attributes) : {}
    var modelURL  = this.model && this.model.url()

    return _.extend(modelJson, {
      current_user : app.currentUser.attributes,
      loggedIn : app.currentUser.authenticated(),
      url : modelURL
    });
  },

  render : function() {
    this.renderTemplate()
    this.renderSubviews()
    this.renderPluginWidgets()
    this.removeTooltips()

    this.renderBaseViews && this.renderBaseViews()
    return this
  },

  renderTemplate : function(){
    var presenter = _.isFunction(this.presenter) ? this.presenter() : this.presenter
    this.template = JST[this.templateName]
    if(!this.template) {
      console.log(this.templateName ? ("no template for " + this.templateName) : "no templateName specified")
    }

    this.$el
      .html(this.template(presenter))
      .attr("data-template", _.last(this.templateName.split("/")));
    this.postRenderTemplate();
  },

  postRenderTemplate : $.noop, //hella callbax yo

  renderSubviews : function(viewsObject){
    var self = this;

    _.each(viewsObject || this.subviews, function(property, selector){
      var view = _.isFunction(self[property]) ? self[property]() : self[property]
      if(view) {
        self.$(selector).html(view.render().el)
        view.delegateEvents();
      }
    })
  },

  renderPluginWidgets : function() {
    this.$(this.tooltipSelector).tooltip();
    this.$("time").timeago();
  },

  removeTooltips : function() {
    $(".tooltip").remove();
  },

  setFormAttrs : function(){
    this.model.set(_.inject(this.formAttrs, _.bind(setValueFromField, this), {}))

    function setValueFromField(memo, attribute, selector){
      if(attribute.slice("-2") === "[]") {
        memo[attribute.slice(0, attribute.length - 2)] = _.pluck(this.$el.find(selector).serializeArray(), "value")
      } else {
        memo[attribute] = getFieldValue(this.$el.find(selector))
      }
      return memo
    }

    function getFieldValue($element){
      if($element.attr('contenteditable')){
        var output = rawText($element)
        return output
      } else {
        return $element.val() || $element.text();
      }

      function rawText(element) {
        var text = element.html()
        var foo = text.replace(/\n/g, '').replace(/<div><br><\/div>/g, '<br>').replace(/<div>/g, '<br>').replace(/<\/div>/g, "")
        return foo
      }
    }
  },

  bookmarkletJS : function() {
    var location = document.location.protocol +"//"+ document.location.hostname
    return "javascript:void(function(){ if(window.location.host.match(/makr/)){alert('Drag the \"Remix\" button to your bookmarks bar to easily remix any photo while you browse the web!');return};\
    if(document.getElementsByTagName('head').length ==0){document.getElementsByTagName('html')[0].appendChild(document.createElement('head'))} \
    var head= document.getElementsByTagName('head')[0]; \
    var script= document.createElement('script'); \
    script.type= 'text/javascript'; \
    script.src= '" + location +  "/bookmarklet.js'; \
    script.id= 'makrio-bm-script'; \
    script.setAttribute('data-origin','" + location + "'); \
    head.appendChild(script);}());";
  },


  destroyModel: function(evt) {
    evt && evt.preventDefault();
    if (confirm(Diaspora.I18n.t("confirm_dialog"))) {
      this.model.destroy();
      this.remove();
    }
  },

  showModalFramer : function(evt){
    evt && evt.preventDefault();
    var target = $(evt.target)

    var post_id = target.data('remix-id')
      , post = (post_id =='new') ? undefined : (this.stream && this.stream.items.get(post_id) && this.stream.items.get(post_id).buildRemix()) || this.model.buildRemix()
      , tag = target.data('tag')

    this.framer = new app.views.InlineFramer({model : post, tag: tag})
    this.framer.show()
  },

  showModalComments : function(evt){
    evt && evt.preventDefault();
    var commentsView = new app.views.InlineComments({model : this.model})
    this.showModal(commentsView)
  },

  showModal : function(view) {
      if(view.model && view.model.interactions) {
        view.model.interactions.fetch().done(_.bind(setFacebox, view))
      } else {
        _.bind(setFacebox, view).call()
      }

      /* context for this function is a view object */
      function setFacebox(){
        $.facebox.settings.closeImage = '/assets/facebox/closelabel.png'
        $.facebox.settings.loadingImage = '/assets/facebox/loading.gif'
        $.facebox.settings.opacity = 0.5
        $.facebox.settings.faceboxHtml =   '<div id="facebox" style="display:none;"> \
      <div class="popup"> \
        <div class="content" style="overflow:hidden;"> \
        </div> \
        <a href="#" class="close"></a> \
      </div> \
    </div>' 
    
        $(document).on('afterClose.facebox', function(){
          $('body').removeClass('lock')
          $(document).off('afterClose.facebox')
        })

        $('body').addClass('lock')
        $.facebox(this.render().el)
      }
  },

 requireAuth : function(evt) {
    if( app.currentUser.authenticated () ) { return true }
    evt && evt.preventDefault() && evt.stopImmediatePropagation()
    this.showModalLogin(evt)
    return false 
    // app.router.setLocation('/users/sign_up')
  },

  showModalLogin : function(evt){
    evt && evt.preventDefault()
    this.showModal(new app.views.InlineLogin({}))
  }
});
