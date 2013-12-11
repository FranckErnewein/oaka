define([
	'backbone',
	'core/model/Article'
], function( Backbone, Article ){
	return Backbone.Collection.extend({
		model: Article,
		getRequiredArticles: function(){
			return this.reduce( function( memo, a ){
				return memo + a.get('required');
			}, 0);
		},
		getSelectedArticles: function(){
			return this.reduce( function( memo, a ){
				return memo + a.getTotalItemSelected();
			}, 0);
		},
		getMissingArticles: function(){
			return this.getTotalArticles() - this.getSelectedArticles();
		}
	});
});
