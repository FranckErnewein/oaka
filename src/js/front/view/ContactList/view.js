define([
	'backbone',
	'front/view/ListView',
	'view!front/view/ContactItem'
], function( Backbone, ListView, ContactItem ){

	return Backbone.View.extend({
		subviews: [
			{
				cstr: ListView,
				options: function(){
					return {
						el: this.$('.receivers-list'),
						collection: this.collection,
						cstr: ContactItem
					}
				}
			}
		],
		events: {
			'submit .add-contact': 'addContact'
		},
		addContact: function(){
			var field = this.$('.new-contact-email');
			this.collection.add({ email: field.val() });
			field.val('');
			return false;
		}
	});

});
