define([
	'module',
	'jquery',
	'underscore',
	'backbone',
	'less'
], function( module, $, _, Backbone, less ){
	'use strict';
	var cssNode;
	if( typeof document != 'undefined' ){
		cssNode = document.createElement( 'style' );
		cssNode.type = 'text/css';
		$(document.head).append( cssNode );
	}

	var lessParser = new less.Parser();

		
	return {
		version: '2.0.1',
		load: function( name, req, onLoad, config ){
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }
			req([
				name + '/view',
				'text!' + name + '/style.less',
				'text!' + name + '/template.html'
			], function( view, lessString, html ){

				var className = name.replace(/\//g, '-');
				
				lessParser.parse( lessString.replace('view', className), function( e, tree ){
					if( e ){
						console.error( 'LESS ERROR', e );
					}else{
						cssNode.innerHTML += tree.toCSS();	
					}
				});

				try{
					var compiledTemplate = _.template( html );
				}catch(e){
					throw new Error( 'Template Compilation Error: '+ name+'/template.html' );
				}

				onLoad( view.extend({
					className: className,
					render: function(){
						this.removeSubviews();
						if( this.el ) this.el.id = this.cid;
						var html; 
						try{
							html = compiledTemplate.call( this, this );
						}catch( e ){
							html = '<pre style="color:red !important;border:2px solid red !important;">' + e.stack + '</pre>';

						}
						this.$el.addClass( className ).html( html );
						_.each( this.subviews, function( subview, i ){
							if( typeof subview.cstr != 'function' ){ throw new ReferenceError( className + '.subviews[' + i + '].cstr is not a function' ); }
							if( typeof subview.options != 'function' ){ throw new ReferenceError( className + '.subviews[' + i + '].options is not a function' ); }
							var options = subview.options.call( this );
							if( !options ){ throw new ReferenceError( className + '.subviews[' + i + '].options does not return a valid object' ); } 
							var instance = new subview.cstr( options ).render();
							instance.parent = this;
							instance.options = options;
							this._subviews.push( instance );
							var name = subview.name || options.name;
							if( name ){
								this._byName[ name ] = instance;
							}
						}, this);
						if( this.onRender ){
							this.onRender();
						}
						this.trigger( 'render', this );
						console.log( 'render view ' + className );
						return this;
					},
					getSubview: function( indexOrCstr ){
						if( typeof indexOrCstr == 'number' ){
							return this._subviews[indexOrCstr];
						}else if( typeof indexOrCstr == 'function' ){
							return _.find( this._subviews, function( subview ){
								return (subview instanceof indexOrCstr);
							});
						}
					},
					getSubviewByName: function( name ){
						return _.find( this._subviews, function( subview ){
							return subview.options.name == name;
						});
					},
					removeSubviews: function(){
						_.each( this._subviews, function( subview ){
							subview.remove();	
						});
						this._subviews = [];
						this._byName = {};
					},
					remove: function(){
						this.removeSubviews();
						view.prototype.remove.apply( this, arguments );
					}
				}) );

			});
		}
	};
});
