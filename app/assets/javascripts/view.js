//= require mailchimp/jquery.form

var View = {
  initialize: function() {

    /* label placeholders */
    $("input, textarea").placeholder();

    /* Avatars */
    $(this.avatars.selector).error(this.avatars.fallback);

    /* facebox */
    $('a[rel*=facebox]').facebox();

    //I am a jerk; ms
    $("form[name='tagForm']").live("ajax:success",function(evt,xhr,settings){
       var flash = new Diaspora.Widgets.FlashMessages;
       flash.render({
        success: true,
        notice: "Tags Updated"
      });
    })

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
