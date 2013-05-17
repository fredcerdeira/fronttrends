(function(){


	var PostModel = Backbone.Model.extend({

	});

	var PostsModel = Backbone.Collection.extend({
		model: PostModel,
		url: 'js/models/db.json'	
	});

	var SearchModel = Backbone.Model.extend({
		defaults: { query: '', year: '2013', loaded: false },

		initialize: function(options) {
			var self = this;
			this.posts = new PostsModel;
			this.posts.fetch({ success: function(model, result) {
				self.set('loaded', true);
			} });
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
			var posts = this.model.getPosts(), view = this;

			this.fetchTemplate('js/templates/results.html', function(tmpl){
				view.$el.html(tmpl({ posts: posts }));

				$('iframe').load(function() {
					view.loadingVideo();
				});

			});	
		},

		fetchTemplate: function (path, done) {

		    window.JST = window.JST || {};

		    if (JST[path]) {
		        return done(JST[path]);
		    }

		    return jQuery.get(path, function (contents) {
		        var tmpl = _.template(contents);

		        JST[path] = tmpl;

		        done(tmpl);
		    });
		},

		loadingVideo: function() {
			$('.loading').hide();
			$('.video').show();
		}

	});

	var MainView = Backbone.Model.extend({
		el: '.main',

		initialize: function(options) {
			this.model = new SearchModel;
			this.results = new ResultsView( { model: this.model } );
			this.search = new SearchView( { model: this.model } );
		}
	});

	$(document).ready (function() {
		var main = new MainView;
	});

})();
	
