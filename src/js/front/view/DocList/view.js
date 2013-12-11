define([
	'backbone',
	'front/view/ListView',
	'view!front/view/DocListItem'
], function( Backbone, ListView, DocListItem ){
	
	return Backbone.View.extend({
		subviews: [
			{
				cstr: ListView,
		   		options: function(){
					return {
						cstr: DocListItem,
						el: this.$('.result-list'),
						collection: this.collection
					};
				}
			}
		],
		initialize: function(){
		}


	});

});
