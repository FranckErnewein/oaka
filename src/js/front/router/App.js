define([
	'backbone',
	'view!front/view/Root'
], function( Backbone, Root ){
	
	return Backbone.Router.extend({
		routes:{
			'doc/:id': 'displayDoc',
			'doc/:id/:token': 'displayDoc',
			'docs': 'allDocs'
		},
		
		initialize: function(){
			this.root = new Root({
				el: document.body
			}).render();
		},
		
		displayDoc: function( id, token ){
			this.root.displayDoc( id, token );
		},

		allDocs: function(){
			this.root.displayList();
		}

	});
});
