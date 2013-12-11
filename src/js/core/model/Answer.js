define([
	'core/model/Base',
	'utils/Type'
], function( Base, Type ){
	return Base.extend({
		idAttribute: 'article',
		defaults: {
			quantity: 0,
		  	unit_price: 0,
		  	global_price: 0,
			visible: true,
			selected: false
		},
		schema: {
			quantity: new Type.Float(),
			unit_price: new Type.Float(),
			global_price: new Type.Float()
		},

		validate: function( json ){
			var error = Base.prototype.validate.call( this, json );
			var article = this.getArticle();

			if( !error && article ){
				if( json.quantity > article.get('required') ){
					error = {
						quantity: json.quantity
					}
				}
			}
			return error;
		},

		getArticle: function(){
			var doc = this.getRoot();
			if( doc && doc.articles ){
				return doc.articles.get( this.id );
			}
		},

		set: function( data, options ){
			if( data.visible == false && this.get('selected') ){
				data.selected = false;
			}
			return Base.prototype.set.call( this, data, options );
		},
		
		getGlobalPrice: function(){
			return this.get('global_price') || parseInt( this.get('quantity') ) * parseInt( this.get('unit_price') );
		},

		toggleVisibility: function(){
			this.set({ visible: !this.get('visible') });
		},

		toggleSelect: function(){
			this.set({ selected: !this.get('selected') });
		},

		processed: function(){
			return !(this.getGlobalPrice() > 0);
		}
	
	});
});
