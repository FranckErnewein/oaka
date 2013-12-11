define([
	'underscore',
	'backbone',
	'core/model/Author',
	'utils/Mongo'
], function( _, Backbone, Author, Mongo ){

	var mongo = new Mongo();
	var getInfos = function( author, field, fieldItem, callback ){
		mongo.getModel('document').mapReduce({
			scope: {
				field: field,
				fieldItem: fieldItem
			},
			query: {
				author: author
			},
			map: function(){
				if( this[field] ){
					this[field].forEach( function( item ){
						emit( item[ fieldItem ], {count:1});
					});
				}
			},
			reduce: function( k, vals ){
				var count = 0;	
				vals.forEach( function( v ){
					count += v['count'];
				});
				return { count: count };
			}
		}, function( err, col ){
			console.log( col );
			if( err  ){
				//error
				console.log( 'ERROR, MapReduce ' + field + ':' + fieldItem );
				callback([]);
			}else{
				callback( _.map( _.sortBy( col, function( o ){
					return o.count 
				}), function( o ){
					return o._id		
				}));
			}
		});
	};

	return Author.extend({

		idAttribute: '_id',

		mongoModel: mongo.getModel('users'),

		isLogged: function(){
			return ( this.get('email') ) ? true : false;
		},

		login: function( login, password ){
			var def = new _.Deferred();
			var self = this;
			this.mongoModel.findOne({email: login, password: password}, function( err, mongoModel ){
				if( mongoModel ){
					var data = mongoModel.toObject();
					delete data.password;
					self.set( data );	
				}
				def.resolve();
			});
			return def;
		},

		sync: function( method, model, options ){
			var def = new _.Deferred();
			var success = function( r ){
				options.success( r );
				def.resolve( r );	
			};
			if( method == 'create' ){
				//TODO
			}else if( method == 'read' ){
				var self = this;
				console.log( this.id );
				console.log( this );
				this.mongoModel.findById( this.id, function( error, mongoModel ){
					if( mongoModel ){
						var data = mongoModel.toObject();
						delete data.password;
						getInfos( self.id, 'articles', 'name', function( articleList ){
							data.all_articles = articleList;	
							getInfos( self.id, 'receivers', 'email', function( contactList ){
								data.all_contacts = contactList;
								success( data )
							});
						});
					}
				});

			}else if( method == 'update' ){
				//TODO
			}else if( method == 'delete' ){
				//do nothing
			}
			return def;
		}

	});
});
