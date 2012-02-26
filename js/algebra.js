var exports = exports || {};
var require = require || function() {};
var permutations = permutations || require("./permutations.js");

var Term = function (coefficient, dimensions) {
	this.coefficient = coefficient;
	this.dimensions = dimensions.slice(0);
	
	var n = permutations.swaps(this.dimensions);
	this.coefficient *= n;
}

var Multivector = function () {
	this.terms = Array.prototype.slice.call(arguments);
	// TODO: Cleanup
}


//exports.multivector = multivector;