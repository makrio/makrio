/*   Copyright (c) 2010-2011, Diaspora Inc.  This file is
 *   licensed under the Affero General Public License version 3 or later.  See
 *   the COPYRIGHT file.
 */
//= require mailchimp/jquery.form
var View = {
  initialize: function() {

    /* label placeholders */
    $("input, textarea").placeholder();

    /* Avatars */
    $(this.avatars.selector).error(this.avatars.fallback);

    /* facebox */
    $.facebox.settings.closeImage = '/assets/facebox/closelabel.png';
    $.facebox.settings.loadingImage = '/assets/facebox/loading.gif';
    $.facebox.settings.opacity = 0.75;

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
