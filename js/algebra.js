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

Term.prototype.vanishes = function() { return this.coefficient == 0; };
Term.prototype.neg = function () {
	return new Term(-this.coefficient, this.dimensions);
}

Term.combine_bases = function (terms) {
	var k, coeffs = {};
	var key, value;
	var combined = [];

	for (k = 0; k < terms.length; k++) {
		key = terms[k].dimensions;
		value = key in coeffs? coeffs[key]: 0;
		coeffs[key] = value + terms[k].coefficient;
	}
	// The hash converts the keys into strings. Can not use for .. in
	// What is this bullshit.
	for (k = 0; k < terms.length; k++) {
		key = terms[k].dimensions;
		if (key in coeffs) {
			combined.push(new Term(coeffs[key], key));
			delete coeffs[key];
		}
	}
	return combined;
};

Term.cmp = function(a, b) {
	var diff = a.dimensions.length - b.dimensions.length;
	var k;

	if (diff)
		return diff;
	for (k = 0; k < a.dimensions.length; k++) {
		diff = a.dimensions[k] - b.dimensions[k];
		if (diff)
			return diff;
	}
	return 0;
};


function Multivector(terms) {
	var k;
	this.terms = [];
	terms = Term.combine_bases(terms);

	for (k = 0; k < terms.length; k++)
		if (!terms[k].vanishes())
			this.terms.push(terms[k]);

	// Create a useful 0 entry
	if (this.terms.length == 0)
		this.terms.push(new Term(0, []));

	this.terms.sort(Term.cmp);
}

Multivector.prototype.toString = function() {
	var k, items = [];
	for (k = 0; k < this.terms.length; k++)
		items.push("(" + this.terms[k] + ")");

	return items.join(" + ");
};

Multivector.prototype.outputFormat = function() {
	function formatTerm(t) {
		return {
			coefficient: t.coefficient,
			sign: t.coefficient >= 0? '+': '-',
			abs_coefficient: Math.abs(t.coefficient),
			dimensions: t.dimensions
		}
	}
	
	var k, out = [];
	for (k=0; k < this.terms.length; k++)
		out.push(formatTerm(this.terms[k]));
	return out;
};

Multivector.prototype.plus = function(other) {
	return new Multivector(this.terms.concat(other.terms));
}
Multivector.prototype.minus = function(other) {
	return this.plus(other.neg());
}
Multivector.prototype.neg = function() {
	var k, terms = [];
	for (k = 0; k < this.terms.length; k++)
		terms.push(this.terms[k].neg());

	return new Multivector(terms);
}


/* Helper function for creating vectors */
function v() {
	var coefficients = Array.prototype.slice.call(arguments);
	var k, terms = [];

	for (k = 0; k < coefficients.length; k++)
		terms.push(new Term(coefficients[k], [k + 1]));

	return new Multivector(terms);
}

/* Helper function for creating scalars */
function s(coefficient) {
	var term = new Term(coefficient, []);
	return new Multivector([term]);
}

var algebra = {
	Multivector: Multivector,
	v: v,
	s: s
};



for (p in algebra)
	if (algebra.hasOwnProperty(p))
		exports[p] = algebra[p];
