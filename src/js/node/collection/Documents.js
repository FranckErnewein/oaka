define([
	'underscore',
	'core/collection/Documents',
	'node/model/Document'
], function( _, CoreDocs , NodeDoc ){
	
	return CoreDocs.extend({
		model: NodeDoc,
		mongoModel: NodeDoc.prototype.mongoModel,
		sync: function( method, collection, options ){
			var def = new _.Deferred();
			var callback = function( err, data ){
				if( err ){
					console.log( 'mongo error' );
					console.log( err );
					if( options.error ) options.error( err );
					def.reject( err );
				}else{
					var r = _.map( data, function( mongoosModel ){
						return mongoosModel.toObject();
					});
					options.success( r );
					def.resolve( r );	
				}
			};
			if( method == 'create' ){
				//TODO
			}else if( method == 'read' ){
				var self = this;
				this.mongoModel.find( options.conditions,  {}, callback);
			}else if( method == 'update' ){
				//TODO
			}else if( method == 'delete' ){
				//do nothing 
			}
			return def;
		},
	});

});
