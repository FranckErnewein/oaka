define([
	'backbone',
	'front/view/DoubleBinding'
], function( Backbone, DoubleBinding ){
	
	return Backbone.View.extend({
		events: {
			'click .save-doc': 'saveDoc',
			'click .undo-change': 'undo'
		},
		undo: function(){
			this.model.fetch();	
			this.docChanged = 0;
			return false;
		},
		saveDoc: function(){
			this.model.save();
			this.docChanged = 0;
			return false;
		},
		initialize: function(){
			this.docChanged = 0;
			this.model.on('change', this.onModelChange, this );
			this.model.on('network:error', this.onNetworkError, this );
			this.model.on('network:success', this.render, this );
		},

		onModelChange: function(){
			this.docChanged++;
			if( this.docChanged > 1 ){
				this.$('.saveblock').show();
			}else{
				this.$('.saveblock').hide();
			}
		},

		onRender: function(){
			var doc = this.model;
			this.$('.answer-item').each( function( i, node ){
				var answer = doc.getAnswer( $(node).attr('data-article'), $(node).attr('data-receiver') );
				new DoubleBinding({
					el: node,
					model: answer
				});
			});
			this.$('.saveblock').hide()
		},

		onNetworkError: function( method, xhr ){
			this.$el.trigger( 'network:error', method, this.model, xhr );
		},

		remove: function(){
			Backbone.View.prototype.remove.call( this );
			this.model.on('change', this.onModelChange );
			this.model.on('network:error', this.onNetworkError );
			this.model.on('network:success', this.render );
		}
	});

});
