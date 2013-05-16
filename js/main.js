(function(){

	var PostModel = Backbone.Model.extend({

	});

	var PostsModel = Backbone.Collection.extend({
		model: PostModel,
		url: 'js/models/db.json'
	});

	var SearchModel = Backbone.Model.extend({
		defaults: { query: '', year: '2013' },

		initialize: function(options) {
			this.posts = new PostsModel;
			this.posts.fetch();
		},

		getPosts: function() {
			var result = this.posts.where({ year: this.get('year') });

			if(this.get('query') != '') {

			}
			//if(this.posts not empty)
			//query this.posts using query and year
			return result.toJSON();
		}
	});

	var SearchView = Backbone.Model.extend({
		el: '.main-header',

		events: {
			'click .years a': 'changeYear',
			'keyup .search': 'changeQuery'
		},

		changeYear: function(e) {
			e.preventDefault();
			var target = e.currentTarget;
			this.model.set('year', $(target).text());
		},

		changeQuery: function(e) {
			this.model.set('query', $('.search').val());
		}
	});

	var ResultsView = Backbone.Model.extend({
		el: '.sessions',

		initialize: function() {
			this.model.on('change', this.update);
		},

		update: function() {
			var posts = this.model.getPosts();

			var output = "";

			for (var i = 0; i < posts.length; i++) {
				output+="<section class='col'><ul>";

				for (var j in posts[i]) {

	    			if (posts[i][j]) { output+="<li>" + posts[i][j]+ "</li>"; }
	    				 		
				}

				output+="</ul></section>";
			};
			

			$('.sessions').html(output);
			//this.$el.html(_.template(postsTemplate, posts));
		}
	});

	var MainView = Backbone.Model.extend({
		el: '.main',

		initialize: function(options) {
			this.model = new SearchModel;
			this.posts = new PostsModel;
			this.results = new ResultsView( { model: this.model } );
			this.search = new SearchView( { model: this.model } );
		}
	});

	$(document).ready (function() {
		
		var main = new MainView();
		
		/*
		$.getJSON('js/models/db.json', function(data) {
			console.log(data);

			var output = "";

			for (var i = 0; i < data.length; i++) {
				output+="<section class='col'><ul>";

				for (var j in data[i]) {

	    			if (data[i][j]) { output+="<li>" + data[i][j]+ "</li>"; }
	    				 		
				}

				output+="</ul></section>";
			};
			

			$('.sessions').html(output);

		});*/
	});

})();
	
