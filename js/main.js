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
			var models = this.posts.where({ year: this.get('year') }),
				result = [];
				model = this;

			if(this.get('query') != '') {
				models = _.filter(models, function(post) { 
					for(var i = 0, len = post.get('tags').length; i < len; i++) {
						if(post.get('tags')[i] == model.get('query')) return true;
					}
					return false;
				});
			}

			for(var i = 0, len = models.length; i < len; i++) {
				result.push(models[i].toJSON());
			}

			return result;
		}
	});

	var SearchView = Backbone.View.extend({
		el: '.main-header',

		events: {
			'click .years a': 'changeYear',
			'keyup .search': 'changeQuery'
		},

		changeYear: function(e) {
			e.preventDefault();
			var target = e.currentTarget;
			this.model.set('year', $(target).text());
			$('.years li').removeClass('active');
			$(target).parent().addClass("active");
		},

		changeQuery: function(e) {
			this.model.set('query', $('.search').val());
		}
	});

	var ResultsView = Backbone.View.extend({
		el: '.sessions',

		initialize: function() {
			_.bindAll(this, 'update');

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
			/*
			var self = this; 
			var tpl = $.ajax({
			  			url: 'js/templates/results.html'
					  }).done(function() {
					  	//console.log(tpl.responseText)
  						 self.$el.html(_.template(tpl.responseText, posts));
					  });

					  */
		
			
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
		var main = new MainView;
	});

})();
	
