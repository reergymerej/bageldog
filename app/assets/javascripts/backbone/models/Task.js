var Task = Backbone.Model.extend({
	url: function(){
		var url = '/tasks';
		
		if(!this.isNew()){
			url += '/' + this.id;
		};

		return url + '.json';
	},
	initialize: function(){
	}
});