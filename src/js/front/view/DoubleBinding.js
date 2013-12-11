define([
	'underscore',
	'backbone'
], function( _, Backbone ){

	return Backbone.View.extend({

		events: {
			'change': 'fieldChange'
		},
		
		initialize: function(){
			this.$fields = {};
			this.setFields( this.options.fields );
			this.model.on('change', this.onModelChange, this );
		},

		onModelChange: function( model ){
			_.each( model.changed, this.setField, this);
		},

		fieldChange: function( e ){
			var field = $(e.target);
			var name = field.attr('name');
			var data = [];
			data[ name ] = field.val();
			this.model.set( data );
			if( this.model.validationError && this.model.validationError[ name ] ){
				this.$el.addClass( 'error' );	
			}else{
				this.$el.removeClass( 'error' );	
			}
		},

		getField: function( name ){
			if( !this.$fields[ name ] ){
				this.$fields[ name ] = this.$('[name='+name+']');
			}
			return this.$fields[ name ];
		},

		setField: function( value, name ){
			var field = this.getField( name );
			if( field && field.length > 0 ){
				field.val( value );	
			}
		},

		setFields: function( fieldList ){
			_.each( fieldList || this.model.attributes, this.setField, this);
		},


		remove: function(){
			this.model.off('change', this.onModelChange );
			Backbone.View.prototype.remove.call( this );
		}
		

	});
});
