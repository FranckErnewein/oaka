define([
	'utils/Mongo',
	'node/model/Author',
	'node/model/Document',
	'node/collection/Documents'
], function( Mongo, Author, Doc, Docs ){

	var http = require('http');
	var express = require('express');
	var socketio = require('socket.io');
	
	return function(){

		var base = process.mainModule.filename.replace('app.js', '');
		var mongo = new Mongo();

		var app = express();
		app.configure( function(){
			this.use(express.cookieParser());
			this.use(express.session({
				"secret": "oaka private string",
				"store":  new express.session.MemoryStore({ reapInterval: 60000 * 10 })
			}));
		});

		app.use(express.bodyParser());
		app.use(express.static( base + 'src/' ) );

		var server = http.createServer( app );
		server.listen( 3000 );

		app.get('/api/1/author', function( req, res ){
			if( req.session.user ){
				var author = new Author({_id: req.session.user });
				console.log( author );
				console.log( req.session.user );
				author.fetch().done( function(){
					//res.send( author.toJSON() );
				});
			}else{
				return res.send( 403 );
			}
		});

		app.post('/api/1/session/author', function( req, res ){
			var author = new Author();
			author.login( req.body.email, req.body.password ).done( function(){
				req.session.user = author.id;
				res.send({
					login: true
				});
			}).fail( function(){
				res.send( 403 );	
			});
		});

		app.get('/api/1/docs', function( req, res ){
			if( req.session.user ){
				var docs = new Docs();
				docs.fetch({
					conditions: {
						author: req.session.user
					}
				}).done( function(){
					res.send( docs.toJSON() );
				});
				return docs;
			}else{
				return res.send( 403 );
			}
		});

		app.get('/api/1/doc/:docid/', function( req, res ){
			var doc = new Doc({_id: req.params.docid });
			doc.fetch().done( function(){
				if( doc.get('author' ) == req.session.user ){
					return res.send( doc.toJSON() );
				}else{
					return res.send( 403 );
				}
			}).fail( function(){
				res.send( 404 );	
			});
		});

		app.get('/api/1/doc/:docid/:token', function( req, res ){
			var doc = new Doc({_id: req.params.docid });
			doc.fetch().done( function(){
				res.send( doc.toJSONForToken( req.params.token ) || 403 );
			});
		});

		app.post('/api/1/doc/', function( req, res ){
			if( req.session.user ){
				var doc = new Doc({
					author: req.session.user
				});
				doc.save().done( function(){
					res.send( doc.toJSON() );
				});
			}else{
				res.send( 403 );
			}
			//TODO
		});

		app.put('/api/1/doc/:docid', function( req, res ){
			var doc = new Doc({_id: req.params.docid });
			doc.fetch().done( function(){
				doc.set( req.body );
				doc.save().done( function(){
					res.send({saved:true});
				}).fail( function( err ){
				 	res.send( err, 401 );
				});
			}).fail( function(){
				res.send( 404 );	
			});
			return doc;
		});

		app.put('/api/1/doc/:docid/:token', function( req, res ){
			var doc = new Doc({_id: req.params.docid });
			var inc = new Doc( req.body );
			doc.fetch().done( function(){
				var receiver =	doc.receivers.getByToken( req.params.token ); 
				var receiver_inc =	inc.receivers.getByToken( req.params.token ); 
				if( !receiver ){
					res.send( 403 );
				}else if( !receiver_inc ){
					res.send( 400 );
				}else{
					receiver_inc.answers.each( function( answer_inc ){
						var answer = receiver.answers.get( answer_inc.id );
						answer.set({
							quantity: answer_inc.get('quantity'),
							unit_price: answer_inc.get('unit_price'),
							global_price: answer_inc.get('global_price')
						});
					});
					doc.save().done( function(){
						res.send({saved:true});
					}).fail( function( err ){
						res.send( err, 401 );
					});
				}
			});
		});

		app.del('/api/1/doc/:docid', function( req, res ){
			if( req.session.user ){
				var doc = new Doc({_id: req.params.docid });
				doc.fetch().done( function(){
					if( doc.get('author') == req.session.user ){
						doc.destroy().done( function(){
							res.send({ deleted: req.params.docid });
						});
					}else{
						res.send(403);
					}
				});
			}else{
				res.send(403);
			}
		});

	}
	

});
