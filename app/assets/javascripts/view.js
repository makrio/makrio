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

  $.fn.loadText = function( textArray, interval ) {
      return this.each( function() {
          var obj = $(this);
          obj.fadeOut( 'slow', function() {
              obj.empty().html( random_array( textArray ) );
              obj.fadeIn( 'slow' );
          });
          timeOut = setTimeout( function(){ obj.loadText( textArray, interval )}, interval );
          // reload random text (if not animated) -- entirely optional, can be removed, along with the reload link above (<a id="text-reload" href="javascript:;"><em>randomize</em></a>)
          $("#text-reload").click( function(){
              if( !obj.is(':animated') ) { clearTimeout( timeOut ); obj.loadText( textArray, interval );} // animation check prevents "too much recursion" error in jQuery
          });
      });
  }
  //public function
  function random_array( aArray ) {
      var rand = Math.floor( Math.random() * aArray.length + aArray.length );
      var randArray = aArray[ rand - aArray.length ];
      return randArray;
  }



  
  View.initialize();
});
