define([

], function(){
	
	function Token( size, sizeMax ){
		this.size = sizeMax ? this.random( size, sizeMax ) : this.random( size );
		this.string = null;
	}

	Token.prototype = {
		pattern: 'abcedefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_1234567890',
		getRandomChar: function(){
			return this.pattern[ this.random( this.pattern.length-1 ) ];
		},
		random: function( a, b ){
			var max, min;
			if( a && !b ){
				max = a;
				min = 0;
			}else if( a && b ){
				max = Math.max( a, b );
				min = Math.min( a, b );
			}else{
				return 0;
			}
			return min + Math.round( (Math.random() * max - min ) );
		},
		generate: function(){
			var str = '';
			for( var i=0; i<this.size; i++){
				str += this.getRandomChar();
			}
			this.string = str;
			return str;
		},
		get: function(){
			return this.string || this.generate();
		}
	}

	return Token;
});
