define([
	
], function(){

	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost/oaka');
	mongoose.set('debug', true );	

	function Mongo(){

	}

	Mongo.prototype = {
		models:{},
		getModel: function( name ){
			if( !this.models[name] ){
				this.models[name] = mongoose.model( name, mongoose.Schema({}, {strict: false}) );
			}
			return this.models[name];
			
		}
	}

	return Mongo;

});
