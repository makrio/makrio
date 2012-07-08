app.views.PostViewerNewComment = app.views.Base.extend({
  templateName: "post-viewer/new-comment",

  events : {
    "keypress textarea" : "createComment",
    "focus textarea" : "scrollToBottom"
  },

  scrollableArea : "#post-reactions",

  postRenderTemplate : function() {
    this.$("textarea").placeholder();
    this.$("textarea").autoResize({'extraSpace' : 0});
  },

  createComment: function(evt) {
    if(evt.keyCode == 13){
      evt.preventDefault()
      if(this.requireAuth(evt)){
        this.model.comment(this.$("textarea").val());
        this.render() //clear text field
        this.scrollToBottom()
      }
    }
  },

  scrollToBottom : function() {
    $(this.scrollableArea).scrollTop($(this.scrollableArea).prop("scrollHeight"))
  }
});