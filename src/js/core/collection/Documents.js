define([
	'backbone',
	'core/model/Document'
], function( Backbone, Doc ){
	
	return Backbone.Collection.extend({
		model: Doc		
	});

});
