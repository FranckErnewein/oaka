define([
	'backbone'
], function(){
	
	return Backbone.View.extend({
		events: {
			'submit form': 'submitForm'
		},
		submitForm: function( e ){
			var data = {};
			if( ! this.$fields ){
				this.$fields = this.$('[name]');
			}

			this.$fields.each(function( i, node ){
				var $node = $(node);
				var val = $node.val();
				var key = $node.attr('name');
				data[ key ] = val;
			});


			var cstr = this.options.collection.model;
			var model = new cstr();
			model.set( data );
			if( model.validationError ){
				_.each( model.validationError, function( value, key ){
					this.$('[name='+key+']').addClass('error');
				}, this);
					
			}else{
				this.options.collection.add( model );
				this.$fields.val('');
			}
			
			return false;
		}
	});

});
