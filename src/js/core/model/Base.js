define([
	'underscore',
	'backbone'
], function( _, Backbone ){

	return Backbone.Model.extend({

		initialize: function(){
			this.createBridges();
		},

		set: function( data_, options_ ){
			var options = options_ || {};
			options.validate = true;
			var data = this.parse( data_ );
			Backbone.Model.prototype.set.call( this, data, options );
		},

		parse: function( json ){
			_.each( json, function( value, key ){
				if( this.schema && this.schema[ key ] ){
					json[key] = this.schema[ key ].parse( value );
				}
			}, this);
			return json;
		},

		validate: function( data_ ){
			var data = this.parse( data_ );
			var error = {};
			_.each( this.schema, function( schema, key ){
				if( !schema.check( data[ key ] ) ){
					error[key] = data[ key ];
				}
			}, this);
			if( _.size( error ) > 0 ){
				console.log( 'error', this.id, error );
				return error;
			}
		},

		getParent: function(){
			if( this.collection ){
				return this.collection.parent;
			}
		},

		getRoot: function(){
			var iterator = this.getParent();
			while( iterator && iterator.getParent() ){
				iterator = iterator.getParent();
			}
			return iterator;
		},

		createBridges: function(){
			_.each( this.bridges , function( cstr, key ){

				var child = new cstr( this.get( key ) );	
				child.parent = this;

				//child to parent
				var events = (child instanceof Backbone.Model) ? 'change' : 'remove add change sort';
				child.on( events, function(){
					var o = {};	
					o[key] = child.toJSON();
					this.set( o );
				}, this);
				this[key] = child;
				if( child instanceof Backbone.Collection && this.get(key) == undefined ){ 
					var o = {};
					o[key] = [];
					this.set( o );
				}

				//parent to children
				this.on('change:'+key, function( model, value ){
					if( !_.isEqual( child.toJSON() , value ) ){
						child.set( value );
					}
				}, this);

			}, this);
		}

	});
});
