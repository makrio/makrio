app.views.LoginBanner =  app.views.Base.extend({
	templateName: 'login-banner',

	postRenderTemplate : function(){
    	$('body').addClass('with-banner')
        _.defer(function(){$('#stream-interactions').addClass('with-banner')})
	},

	presenter : function(){
		return _.extend(this.defaultPresenter(), {
			onRoot : app.onRoot || app.onStaffPicks
		})
	}
})