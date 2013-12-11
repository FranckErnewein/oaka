define([
	'backbone'
], function( Backbone ){
	return Backbone.Model.extend({
		url: '/api/1/session/author'
	});
});
