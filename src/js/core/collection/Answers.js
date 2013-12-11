define([
	'underscore',
	'backbone',
	'core/model/Answer'
], function( _, Backbone, Answer ){
	return Backbone.Collection.extend({
		model: Answer,
		getTotalPrice: function(){
			return this.reduce( function( memo, answer ){
				return memo + ( answer.get('selected') ? answer.getGlobalPrice() : 0);
			}, 0);
		},

		getSelectedArticles: function(){
			return _.map( this.getSelected(), function( answer ){
				return answer.get('article');				   
			});
		},

		getSelected: function(){
			return this.filter( function( answer ){
				return answer.get('selected');
			});
		}
	});
});
