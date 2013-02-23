var exports = exports || {};
var require = require || function() {};
var permutations = permutations || require("./permutations.js");

function simplifyProduct(dimensions) {
	// Assume sorted input.
	// Assume that every e_i^2 = 1.
	var k = 0, out = [];
	while (k < dimensions.length) {
		if (k + 1 < dimensions.length && dimensions[k] == dimensions[k+1]) {
			k = k + 2;
			continue;
		}
		out.push(dimensions[k]);
		k++;
	}
	return out;
}

function Term(coefficient, dims) {
	var dimensions = dims.slice(0);
	this.coefficient = coefficient;

	var n = permutations.swaps(dimensions);
	this.coefficient *= n;
	this.dimensions = simplifyProduct(dimensions);
}

Term.prototype.toString = function() {
	return this.coefficient + " e" + this.dimensions.join("");
};

Term.prototype.vanishes = function() { return this.coefficient == 0; };
Term.prototype.neg = function () {
	return new Term(-this.coefficient, this.dimensions);
};
Term.prototype.multiply = function(scale, other) {
	var c, dims;
	c = scale * this.coefficient * other.coefficient;
	dims = this.dimensions.concat(other.dimensions);
	return new Term(c, dims);
};

Term.simplifySum = function (terms) {
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
	terms = Term.simplifySum(terms);

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
			magnitude: Math.abs(t.coefficient),
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
Multivector.prototype.scaledGeometricProduct = function(scale, other) {
	var i, j, terms = [], a, b;
	for (i = 0; i < this.terms.length; i++) {
		a = this.terms[i];
		for (j = 0; j < other.terms.length; j++) {
			b = other.terms[j];
			terms.push(a.multiply(scale, b));
		}
	}
	return new Multivector(terms);
};
Multivector.prototype.mult = function(other) {
	return this.scaledGeometricProduct(1, other);
};

// Operations for primarily vectors
// The vectorness isn't strictly enforced at this point
Multivector.prototype.dot = function(that) {
	var AB = this.scaledGeometricProduct(1/2, that);
	var BA = that.scaledGeometricProduct(1/2, this);
	return AB.plus(BA);
};
Multivector.prototype.wedge = function(that) {
	var AB = this.scaledGeometricProduct(1/2, that);
	var _BA = that.scaledGeometricProduct(-1/2, this);
	return AB.plus(_BA);
};
Multivector.prototype.div = function(that) {
	// TODO FIX
	var norm = that.dot(that).terms[0].coefficient;
	return this.scaledGeometricProduct(1/norm, that);
};


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

/* Helper function for creating basis vectors */
function e(dimensions) {
	return new Multivector([new Term(1, dimensions)]);
}

var algebra = {
	Multivector: Multivector,
	v: v,
	s: s,
	e: e,
	simplifyProduct: simplifyProduct
};



for (p in algebra)
	if (algebra.hasOwnProperty(p))
		exports[p] = algebra[p];
