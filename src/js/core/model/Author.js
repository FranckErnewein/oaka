define([
	'utils/Type',
	'core/model/Base',
], function( Type, Base ){

	return Base.extend({
		schema: {
			//email: new Type.Email
		}
	});
});
