var exports = exports || {};
var require = require || function() {};
var permutations = permutations || require("./permutations.js");

function Term(coefficient, dimensions) {
	this.coefficient = coefficient;
	this.dimensions = dimensions.slice(0);

	var n = permutations.swaps(this.dimensions);
	this.coefficient *= n;
}

Term.prototype.toString = function() {
	return this.coefficient + " e" + this.dimensions.join("");
};

function Multivector(terms) {
	this.terms = terms;

	// TODO: Cleanup
}

Multivector.prototype.toString = function() {
	var k, items = [];
	for (k = 0; k < this.terms.length; k++)
		items.push("(" + this.terms[k] + ")");

	return items.join(" + ");
};

function v() {
	var coefficients = Array.prototype.slice.call(arguments);
	var k, terms = [];
	
	for (k = 0; k < coefficients.length; k++)
		terms.push(new Term(coefficients[k], [k + 1]));

	return new Multivector(terms);
}

var algebra = {
	Multivector: Multivector,
	v: v
};



for (p in algebra)
	if (algebra.hasOwnProperty(p))
		exports[p] = algebra[p];
