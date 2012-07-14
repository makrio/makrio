//= require mailchimp/jquery.form

var View = {
  initialize: function() {

    /* label placeholders */
    $("input, textarea").placeholder();

    /* Avatars */
    $(this.avatars.selector).error(this.avatars.fallback);

    /* facebox */
    $('a[rel*=facebox]').facebox();

  },

  avatars: {
    fallback: function(evt) {
      $(this).attr("src", "/assets/user/default.png");
    },
    selector: "img.avatar"
  }
};

$(function() {
  View.initialize();
});
