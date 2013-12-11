define([
	'utils/Type',
	'utils/Token',
	'core/model/Base',
	'core/collection/Answers'
], function( Type, Token, Base, Answers ){
	return Base.extend({
		idAttribute:'email',
		bridges:{
			answers: Answers
		},
		schema:{
			email: new Type.Email()
		},
		set: function( data, options ){
			if( !data.token && !this.get('token') ){
				data.token = new Token( 10, 15 ).get();
			}
			Base.prototype.set.call( this, data, options );
		}
	});
});
