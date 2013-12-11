define([
	'moment',
	'utils/Type',
	'core/model/Base',
	'core/model/Author',
	'core/collection/Receivers',
	'core/collection/Articles'
], function( moment, Type, Base, Author, Receivers, Articles ){
	
	return Base.extend({

		defaults: function(){
			return { 
				devise: '€',
			};
		},

		schema: {
			creation_date: new Type.ISODate
		},
		
		bridges: {
			receivers: Receivers,
			articles: Articles
		},

		authorConstructor: Author,

		initialize: function(){
			Base.prototype.initialize.apply( this, arguments );
			this.author = new this.authorConstructor({ id: this.get('author') });
			this.receivers.on( 'add', this.syncAnswersWithReceivers, this );
			this.articles.on( 'add', this.syncAnswersWithReceivers, this );
			this.articles.on( 'remove', function( article ){
				this.receivers.each( function( receiver ){
					receiver.answers.remove( receiver.answers.get( article.id ) ); 
				}, this);
			}, this );
			this.syncAnswersWithReceivers();
		},

		getAnswer: function( articleId, receiverId ){
			var receiver = this.receivers.get( receiverId );
			return ( receiver ) ? receiver.answers.get( articleId ) : null ;
		},

		syncAnswersWithReceivers: function(){
			this.receivers.each( function( receiver ){
				this.articles.each( function( article ){
					if( !receiver.answers.get( article.id ) ){
						receiver.answers.add({
							article: article.id
						});
					}
				}, this);
			}, this);
		},

		setAuthor: function( author ){
			if( author instanceof this.authorConstructor ){
				this.author = author;	
				this.set({author:author.id});
			}else if( typeof author == 'string' ){
				this.set({author:author});
			}
		},

		getTotalPrice: function(){
			return this.articles.reduce( function( memo, article ){
				return memo + article.getTotalPrice();
			}, 0);
		}



	});
});
