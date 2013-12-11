define([
	'underscore',
	'utils/Mongo',
	'core/model/Document',
	'node/model/Author'
], function( _, Mongo, Doc, Author ){

	var NodeDoc = Doc.extend({

		idAttribute: '_id',

		authorConstructor: Author,
		mongoModel: new Mongo().getModel( 'documents' ),
		defaults: function(){
			var defaults = Doc.prototype.defaults.call( this );
			defaults.creation_date =  moment().toISOString();
		},

		sync: function( method, model, options ){
			var def = new _.Deferred();
			var callback = function( err, model ){
				if( err ){
					console.log( 'mongo error' );
					console.log( err );
					if( options.error ) options.error( err );
					def.reject( err );
				}else{
					var data = model ? model.toObject() : null;
					options.success( data );
					def.resolve( data );	
				}
			};
			if( method == 'create' ){
				new this.mongoModel( this.toJSON() ).save( callback );
			}else if( method == 'read' ){
				var self = this;
				this.mongoModel.findById( this.id, callback);

			}else if( method == 'update' ){
				var self = this;
				var data = this.toJSON();
				delete data._id;
				delete data.__v;
				this.mongoModel.findByIdAndUpdate( this.id, data, {}, callback );
			}else if( method == 'delete' ){
				this.mongoModel.findByIdAndRemove( this.id, {}, callback );
				//do nothing
			}
			return def;
		},

		toJSONForToken: function( token ){
			var clone = new NodeDoc( this.toJSON() );
			var found = false;
			clone.receivers.remove( clone.receivers.filter( function( receiver ){
				return receiver.get('token') != token
			}) );
			/*
			clone.articles.remove( clone.articles.filter( function( article ){
				return !article.getAnswerFromReceiver( clone.receivers.getByToken( token ) ).get('visible');
			}) );
			*/
			return clone.receivers.size() > 0 ? clone.toJSON() : null;
		}
		
	});

	return NodeDoc;

});
