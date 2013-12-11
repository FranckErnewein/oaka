define([
	'backbone',
	'front/view/ListView',
	'view!front/view/Article'
], function( Backbone, ListView, Article ){
	
	return Backbone.View.extend({
		subviews:[
			{
				cstr: ListView,
				options: function(){
					return {
						el: this.$('.article-list'),
						collection: this.model.articles,
						cstr: Article
					};
				}
			},
		],

		initialize: function(){
			this.model.on( 'change', this.render, this );
		}
	});

});
