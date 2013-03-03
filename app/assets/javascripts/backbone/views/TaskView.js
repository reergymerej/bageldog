var TaskView = Backbone.View.extend({

	initialize: function(){
		var that = this;

		this.$el.prependTo(this.options.container);
		this.model.on('change', function(model, changed){
			that.render();
			model.save();
		});
	},

	render: function(){
		var template = _.template( $('#task-template').html(), this.model.toJSON() );
		this.$el.html(template);
	},

	events: {
		'click .delete': 'deleteTask',
		'click .name': 'toggleClaim',
		'dblclick .name': 'editName',
		'change .finish': 'toggleFinish'
	},

	deleteTask: function(ev){
		var that = this;

		this.model.destroy({
			success: function(model, response){
				that.remove();
			},
			error: function(){
				console.error('unable to destroy Task', arguments);
			}
		});

		return false;
	},

	editName: function(ev){
		var nameEl = $(ev.currentTarget),
			newNameEl = $('<input>'),
			that = this;

		nameEl.hide();
		newNameEl
			.val(this.model.get('name'))
			.insertAfter(nameEl)
			.blur(function(){
				var newVal = $(this).val();
				newNameEl.remove();
				nameEl.show();
				that.model.set({name: newVal});
			})
			.focus();
	},

	toggleFinish: function(ev){
		this.model.set({
			status: $(ev.currentTarget).is(':checked') ? 'finished': null
		});
	},

	toggleClaim: function(ev){
		console.log(ev);
	}
})