define([
	'jquery',
	'backbone',
	'front/view/AddForm',
	'front/view/DoubleBinding',
	'view!front/view/AuthorGrid',
	'view!front/view/ContactList'
], function( $, Backbone, AddForm, DoubleBinding, AuthorGrid, ContactList ){
	
	return Backbone.View.extend({
		subviews:[
			{
				cstr: ContactList,
		   		options: function(){
					return {
						el: this.$('.contacts'),
						collection: this.model.receivers
					};
				}
			},
			{
				cstr: AuthorGrid,
				options: function(){
					return {
						el: this.$('.author-grid'),
						model: this.model,
					};
				}
			},
			{
				cstr: AddForm,
				options: function(){
					return {
						el: this.$('.add-article'),
						collection: this.model.articles,
					};
				}
			},
			{
				cstr: DoubleBinding,
				options: function(){
					return {
						el: this.$('.infos'),
						model: this.model,
						fields: ['title', 'address']
					};
				}
			}
		],
		events: {
			'click .save-doc': 'saveDoc',
			'click .undo-change': 'undo',
			'click .delete-doc': 'deleteDoc'
		},
		undo: function(){
			this.model.fetch();	
			this.docChanged = 0;
			return false;
		},
		saveDoc: function(){
			this.model.save();
			this.docChanged = 0;
			this.$('.saveblock').hide();
			return false;
		},
		deleteDoc: function( e ){
			if( confirm('are you sure ?') ){
				this.model.destroy().done( function(){
					document.location.hash = $(e.target).attr('href');
				});
			}
			return false;
		},	
		initialize: function(){
			this.docChanged = 0;
			this.model.on('change', this.onModelChange, this );
			this.model.on('network:error', this.onNetworkError, this );
			this.model.author.on('change', this.setArticleTypeahead, this );
			this.model.author.on('change', this.setContactTypeahead, this );
			console.log( this.model.author.attributes.all_articles );
			this.setArticleTypeahead();
			this.setContactTypeahead();
		},

		setArticleTypeahead: function( model ){
			console.log( this.model.author.attributes.all_articles );
			this.$('.new-article-name').typeahead({source: this.model.author.get('all_articles')});
		},

		setContactTypeahead: function( model ){
			this.$('.new-contact-email').typeahead({source: this.model.author.get('all_contacts')});
		},


		onModelChange: function( model ){
			this.docChanged++;
			this.$('.saveblock')[ this.docChanged > 1 ? 'show' : 'hide' ]();
		},

		onNetworkError: function( method, xhr ){
			this.$el.trigger( 'network:error', method, this.model, xhr );
		},

		remove: function(){
			Backbone.View.prototype.remove.call( this );
			this.model.on('change', this.onModelChange );
			this.model.on('network:error', this.onNetworkError );
		},

	});

});
