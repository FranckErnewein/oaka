define([
	'backbone'
], function( Backbone ){
	
	return Backbone.View.extend({
		tagName: 'tr',
		events:{
			'click a.remove-article': 'removeArticle',
			'click .toggle-visibility': 'toggleVisibility',
			'click .toggle-select': 'toggleSelect'
		},
		getAnswerFromNode: function( node ){
			var $node = $(node);
			return this.model.collection.parent.getAnswer( $node.attr( 'data-article-id' ), $node.attr( 'data-receiver-id' ) )
		},
		selectedState: function(){
			var total = this.model.getTotalItemSelected();
			var required = this.model.get('required');
			if( total == required ){
				return 'success';
			}else if( total == 0 ){
				return '';
			}else if( total > required ){
				return 'error';
			}else{
				return 'info';
			}
		},
		getIndice: function(){
			var indice = this.model.getTotalItemSelected() - this.model.get('required');
			return ((indice > 0) ? ('+'+indice) : (indice || ''));
		},
		onRender: function(){
			this.$el.addClass( this.selectedState() );
		},
		removeArticle: function(){
			this.model.collection.remove( this.model );
			return false;
		},
		toggleVisibility: function( e ){
			var answser = this.getAnswerFromNode( e.target );
			if( answser ){ answser.toggleVisibility(); }
		},
		toggleSelect: function( e ){
			var answser = this.getAnswerFromNode( e.target );
			if( answser ){ answser.toggleSelect(); }
		}

	});

});
