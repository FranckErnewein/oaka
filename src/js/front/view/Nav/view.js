define([
	'backbone',
	'front/model/Document'
], function( Backbone, Doc ){
	
	return Backbone.View.extend({
		events: {
			'click .create-new-doc': 'createNewDoc'
		},

		createNewDoc: function(){
			var self = this;
			console.log( 'hey' );
			new Doc().save().done( function( obj ){
				if( obj && obj._id ){
					document.location.hash = '#doc/' + obj._id;
				}
			});
			return false;
		}
		
	});
});
