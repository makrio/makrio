app.models.Relationship = Backbone.Model.extend({

	urlRoot : "/relationships",

	toggleFollow : function() {
		if(this.id) {
			this.destroy()
			this.unset("id")
		} else {
		    app.instrument("track", "Follow")
			this.save()
		}
	}
});