app.views.LoginBanner =  app.views.Base.extend({
	templateName: 'login-banner',

	postRenderTemplate : function(){
		$('body').addClass('with-banner')
     	_.defer(function(){$('#stream-interactions').addClass('with-banner')})

	    if(window.mixpanel) { 
		    window.mixpanel["track_links"]("a#sign_up_button", "Click Sign Up")
		}
	},

	presenter : function(){
		return _.extend(this.defaultPresenter(), {
			onRoot : app.onRoot || app.onStaffPicks
		})
	}
})