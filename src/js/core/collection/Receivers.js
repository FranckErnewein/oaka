define([
	'backbone',
	'core/model/Receiver'
], function( Backbone, Receiver ){
	return Backbone.Collection.extend({
		model: Receiver,
		getByToken: function( token ){
			return this.find( function( model ){
				return model.get('token') == token;
			});
		}
	});
});
