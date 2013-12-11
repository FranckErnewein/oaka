define([
	'underscore',
	'utils/Type',
	'core/model/Base',
	'core/collection/Answers'
], function( _, Type, Base, Answers ){
	
	return Base.extend({
		idAttribute: 'name',
		schema: {
			required: new Type.Float(),
			name: new Type.String( 1, 400 ),
		},
		defaults:{
			required: 1
		},
		getAnswerFromReceiver: function( receiverOrId ){
			var receiver = ( typeof receiverOrId == 'string' ) ? this.getRoot().receivers.get( receiverId ) : receiverOrId;  
			return receiver.answers.get( this.id );
		},
		isVisible: function(){
			return this.getRoot().receivers.find( function( receiver ){
					return this.getAnswerFromReceiver( receiver ).get('visible');
			}, this ) ? true : false ;
		},

		isComplete: function(){
			return this.get('required') == this.getTotalItemSelected();
		},

		getAnswers: function(){
			return this.getRoot().receivers.map( function( receiver ){
				return receiver.answers.get( this.id );
			}, this);
		},

		getSelected: function(){
			return _.filter( this.getAnswers(), function( answer ){
				return answer ? answer.get('selected') : false;
			});
		},

		getTotalItemSelected: function(){
			return _.reduce( this.getSelected(), function( memo, answer ){
				return memo + answer.get('quantity');	
			}, 0);
		},

		getTotalPrice: function(){
			return _.reduce( this.getSelected(), function( memo, answer ){
				return memo + answer.getGlobalPrice();
			}, 0);
		}
	});
});
