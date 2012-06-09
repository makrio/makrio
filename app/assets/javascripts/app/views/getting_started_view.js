app.views.GettingStarted = app.views.Base.extend({
  id: "getting_started",
  templateName : "getting-started",

  events : {
    "click .gs-done" : 'clearGettingStarted'
  },

  clearGettingStarted : function(evt) {
    if(evt) { evt.preventDefault() }
    
    $.getJSON("/getting_started_completed")
    $("body").removeClass('lock')
    $("#getting_started").fadeOut()
  }
});