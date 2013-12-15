//include require for nodejs
if( typeof window == 'undefined' ){
	requirejs = require('../../r');
}

requirejs.config({
	paths: {
		 //create alias to plugins 
		'async': 'vendor/requirejs-plugins/src/async',
		'font': 'vendor/requirejs-plugins/src/font',
		'goog': 'vendor/requirejs-plugins/src/goog',
		'image': 'vendor/requirejs-plugins/src/image',
		'json': 'vendor/requirejs-plugins/src/json',
		'noext': 'vendor/requirejs-plugins/src/noext',
		'mdown': 'vendor/requirejs-plugins/src/mdown',
		'text': 'vendor/requirejs-plugins/lib/text',
		'propertyParser' : 'lib/requirejs-plugins/src/propertyParser',

		'jquery': 'vendor/jquery/jquery',
		//'underscore': 'vendor/underscore/underscore',
		'underscore': 'vendor/lodash/dist/lodash.underscore',
		'backbone': 'vendor/backbone/backbone',
		'moment': 'vendor/momentjs/moment',
		'less':'vendor/less/dist/less-1.5.1',

		'underscore-def': 'lib/underscore.deferred',
		'bootstrap':'lib/bootstrap'
	},

	shim: {
		'underscore': { exports: '_' },
		'underscore-def': { 
			deps: [ 'underscore' ],
		},
		'jquery': { exports: '$' },
		'backbone': {
			deps: [ 'underscore', 'underscore-def' ],
			exports: 'Backbone'
		},
		'moment': { exports: 'moment' },
		'less': { exports: 'less' }
	}
});


//allow to load this file from nodejs in order to get the require config
if( typeof window != 'undefined' ){
	define([
		'jquery',
		'front/router/App',
	], function( $, App ){

		$(document).ready( function(){
			window.app = new App();
			Backbone.history.start();
		});



	});
}else{
	//fix require config path for node
	requirejs.config({
		baseUrl: './src/js/'
	});
	
	//get module from script name :
	// /usr/local/tweetping/app.js => return app/App
	function getModule(){
		var path = process.mainModule.filename; //get path
		var fileName = path.substr( path.lastIndexOf('/')+1, path.length ); //only filename (app.js)
		var moduleName = fileName.charAt(0).toUpperCase() + fileName.substr( 1, fileName.length - 4 ); //capitalise and remove extenstion
		return 'node/' + moduleName;
	}

	requirejs([
		getModule(),
	], function( Module ){
		//launch dynamique module from script name 
		new Module();		 
	});
}

