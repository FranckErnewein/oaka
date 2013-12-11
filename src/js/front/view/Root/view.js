define([
	'backbone',
	'bootstrap',
	'front/model/Document',
	'front/model/Author',
	'front/collection/Documents',				
	'view!front/view/Nav',
	'view!front/view/Doc',
	'view!front/view/DocList',
	'view!front/view/DocForAnswer'
], function( Backbone, bootstrap, DocModel, Author, DocsCollection, Nav, DocView, DocList, DocForAnswer ){
	
	return Backbone.View.extend({
		subviews: [
			{
				cstr: Nav,
				options: function(){
					return {
						el: this.$('.nav'),
						model: this.model
					}
				}
			},
			{
				cstr: DocList,
				options: function(){
					return {
						el: this.$('.doc-list'),
						collection: new DocsCollection()
					}
				}
			}
		],
		initialize: function(){
			this.author = new Author();
			this.author.fetch();
		},

		events: {
			'submit .login-form': 'login'
		},

		onRender: function(){
			this.$login = this.$('.login-modal').modal({show: false});	
		},

		displayList: function(){
			this.getSubview( DocList ).$el.show();
			this.getSubview( DocList ).collection.fetch();
			if( this.doc ){
				this.doc.$el.hide();
			}
		},

		displayDoc: function( id, token ){
			if( this.doc ){
				this.doc.model.off('network:error', this.login );
				this.doc.remove();
			}

			this.getSubview( DocList ).$el.hide();
			if( token ){
				this.doc = new DocForAnswer({model: new DocModel()});
				this.doc.model.setToken( token );
			}else{
				var model = new DocModel();
				model.setAuthor( this.author );
				this.doc = new DocView({model: model});
			}
			this.doc.model.id = id;
			this.doc.model.on('network:error', this.displayModal , this);
			this.doc.$el.appendTo( this.$('.doc') );
			this.doc.model.fetch();
			this.doc.render();
		},

		login: function(){
			var self = this;
			this.author = new Author({
				email: this.$('.author-email').val(),
				password: this.$('.author-password').val()
			}).login().done( function(){
				if( self.lastNetworkErrorType ){
					self.doc.model[ self.lastNetworkErrorType ]().done( function(){
						self.$login.modal( 'hide' );
						self.lastNetworkErrorType = null;
					});
				}else{
					self.$login.modal( 'hide' );
				}
				//self.author.fetch();
			});
			return false;
		},

		displayModal: function( type ){
			this.$login.modal( 'show' );
			this.lastNetworkErrorType = type;
		},

		remove: function(){
			this.doc.model.off('network:error', this.login );
			Backbone.View.prototype.remove.call( this );
		}
	});

});
