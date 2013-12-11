define([
	'underscore',
	'core/collection/Documents',
	'front/model/Document'
], function( _, CoreDocs , FrontDoc ){
	
	return CoreDocs.extend({
		model: FrontDoc,
		url: 'api/1/docs' 
	});

});
