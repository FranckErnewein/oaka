define([
	'core/model/Document'
], function( CoreDocument ){
	return CoreDocument.extend({
		idAttribute: '_id',
		setToken: function( token ){
			this.token = token
		},
		unsetToken: function(){
			this.token = null;
		},
		url: function(){
			var url = '/api/1/doc/';
			if( this.id ){
				url += this.id + '/';
				if( this.token ){
					url += this.token;
				}
			}
			return url; 
		},
		fetch: function(){
			var self = this;
			self.trigger('network:query');
			return CoreDocument.prototype.fetch.apply( this, arguments ).fail( function( error ){
				self.trigger('network:error', 'fetch', error );	
			}).done( function(){
				self.trigger('network:success', self );	
			});
		},
		save: function(){
			var self = this;
			self.trigger('network:query');
			return CoreDocument.prototype.save.apply( this, arguments ).fail( function( error ){
				self.trigger('network:error', 'save', error );	
			}).done( function(){
				self.trigger('network:success', self );	
			});
		}
	});
});
