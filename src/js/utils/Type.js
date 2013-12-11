define([
	'underscore',
	'moment'
], function( _, moment){


	function TypeString( min, max ){
		this.max = max; this.min = min || 0;
	}
	TypeString.prototype = {
		check: function( value ){
			var isString = _.isString( value );
			if( this.min && isString ) isString = value.length > this.min;
			if( this.max && isString ) isString = value.length < this.max;
			return isString;
		},
		parse: function( value ){
			return (value+'');
		}
	}

	function TypeInt( min, max ){
		this.min = min; this.max = max;
	}
	TypeInt.prototype = {
		check: function( value ){
			return TypeFloat.prototype.check.call( this, value ) && Math.round( value ) == value;
		},
		parse: function( value ){
			return parseInt( value );	
		}
	}

	function TypeFloat( min, max ){
		this.min = min; this.max = max;
	}
	TypeFloat.prototype = {
		check: function( value ){
			var is = _.isNumber( value ) && !_.isNaN( value );
			if( this.min && is ) is = value.length >= this.min;
			if( this.max && is ) is = value.length <= this.max;
			return is;
		},
		parse: function( value ){
			var n = parseFloat( value );
			return n;
		}
	}

	function TypeBoolean(){

	}
	TypeBoolean.prototype = {
		check: function( value ){
			typeof value == 'boolean';		
		},
		parse: function( value ){
			if( typeof value == 'boolean' ){
				return value;
			}else{
				return Boolean( value );
			}
		}
	}

	function TypeEmail(){
		TypeString.call( this, 1, 5000 );
	}
	TypeEmail.prototype = {
		check: function( value ){
			var is = TypeString.prototype.check.call( this, value );
			if( is ) is = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ ).test( value );
			return is;
		},
		parse: function( value ){
			return value;
		}
	}

	function ISODate(){

	}

	ISODate.prototype = {
		check: function( value ){
			return moment( value ).isValid();
		},
		parse: function( value ){
			return ( value ) ? moment( value ).toISOString() : null
		}
	}

	return { 
		Boolean: TypeBoolean,
		String: TypeString,
		Int: TypeInt,
		Float: TypeFloat,
		Email: TypeEmail,
		ISODate: ISODate
	}


});
