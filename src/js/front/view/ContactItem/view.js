define([
	'backbone'
], function( Backbone ){
	
	return Backbone.View.extend({
		tagName: 'span',
		events:{
			'click .remove': 'removeContact'
		},
		removeContact: function(){
			this.model.collection.remove( this.model );
			return false;
		}
	});

});
