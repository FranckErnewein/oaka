define([
	'core/model/Author',
	'front/model/Session'
], function( CoreAuthor, Session ){
	return CoreAuthor.extend({
		url: '/api/1/author',
		login: function( login, pwd ){
			var self = this;
			var email = login || this.get('email'), password = pwd || this.get('password');
			return new Session({
				email: email,
				password: password
			}).save().done( function(){
				self.set({
					email: email,
					password: password
				});
			});
		}
	});
});
