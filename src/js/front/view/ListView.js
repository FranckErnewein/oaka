define([
	'underscore',
	'backbone'
], function( _, Backbone ){

	return Backbone.View.extend({
		initialize: function( options ){
			if( !options.cstr ){
				new ReferenceError( 'you must specified a constructor in options.cstr' );
			}
			this.cstr = options.cstr;
			this.children = {};
			this.collection.on('add', this.addChild, this );
			this.collection.on('remove', this.removeChild, this );
			this.collection.each( this.addChild, this );
		},
		addChild: function( model ){
			var view = new this.cstr({ model: model });
			view.$el.appendTo( this.$el );
			if( view.render ) view.render();
			this.children[ model.id ] = view;
		},
		removeChild: function( model ){
						 console.log( model.id );
			if( this.children[ model.id ] ){
				this.children[ model.id ].remove();	
				delete this.children[ model.id ];
			}
		},
		remove: function(){
			_.each( this.subviews, function( subview ){
				subview.remove();
			});
			this.collection.off('add', this.addChild );
			this.collection.off('remove', this.removeChild );
			Backbone.View.prototype.remove.apply( this, arguments );
		}
	});

});
