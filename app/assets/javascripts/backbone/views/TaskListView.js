var TaskList = Backbone.Collection.extend({
	model: Task,
	url: '/tasks',
	comparator: function(a, b){
		var aCreated = new Date(a.get('created_at')).getTime(),
			bCreated = new Date(a.get('created_at')).getTime();

		return (aCreated - bCreated < 0) ? a : b;
	}
});

var TaskListView = Backbone.View.extend({

	initialize: function(){

		var that = this;

		this.subViews = [];

		this.taskList = new TaskList();
		this.taskList.fetch({
			success:function(collection, models){
				that.render();
			},
			error: function(){
				console.error('unable to fetch collection');
			}
		});

		this.taskList.on('destroy', function(model, response, options){
			
			//	remove the subview reference
			$.each(that.subViews, function(i, view){
				if(view.model === model){
					that.subViews.splice(i, 1);
					return false;
				};
			});
		});

		this.taskList.on('change', function(model, changed){});
	},

	render: function(){
		//	populate this $el
		var that = this,
			template = _.template( $('#taskList-template').html(), {} );
		
		this.$el.html(template);

		//	create a subview for each Task
		$.each(this.taskList.models, function(i, task){
			that.addSubView(task);
		});
	},

	events: {
		'change #finished': 'toggleFinished',
		'submit form': 'submitForm'
	},

	addSubView: function(task){
		var taskView = new TaskView({
			container: $('#tasks', this.$el),
			model: task
		});

		this.subViews.push(taskView);

		taskView.render();
	},

	toggleFinished: function(ev){
		var that = this,
			hideFinished = $(ev.currentTarget).is(':checked');

		$.each(this.subViews, function(i, view){
			if(hideFinished && view.model.get('status') === 'finished'){
				view.$el.hide();
			} else {
				view.$el.show();
			};
				
		});
	},

	submitForm: function(ev){
		var that = this,
			task,
			name = $.trim( $('[name="name"]', ev.currentTarget).val() );

		$('input', ev.currentTarget).val('');

		if(name !== ''){
			task = new Task();
			task.save('name', name, {
				success: function(){
					that.taskList.add(task);
					that.addSubView(task);
				},
				error: function(){
					console.error('unable to save Task');
				}
			});
		};
		return false;
	}
});