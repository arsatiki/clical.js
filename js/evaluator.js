var evaluator = function() {
	var global_scope = {};

	var yyobj = {
		assignment: function (identifier, exp) {
			global_scope[identifier] = exp;
			return {'var': identifier, 'val': exp};
		},
		identifier: function (name) {
			return global_scope[identifier];
		},

		negate: function (exp) { return exp.neg(); },

		conjugate: function (exp) {return undefined;},
		involute: function (exp) {return undefined;},

		add: function(exp1, exp2) {
			return exp1.plus(exp2);
		},
		subtract: function(exp1, exp2) {
			return exp1.minus(exp2);
		},

		power: function(exp1, exp2) { return undefined; },
		outerPower: function(exp1, exp2) { return undefined; },
		multiply: function(exp1, exp2) {
			return exp1.mult(exp);
		},
		innerProduct: function(exp1, exp2) {
			return exp1.dot(exp);
		},
		outerProduct: function(exp1, exp2) {
			return exp1.wedge(exp2);
		},
		div: function(exp1, exp2) {
			return exp1.div(exp2);
		},
		backdiv: function(exp1, exp2) {
			return exp2.div(exp1);
		},

		funcall: function(name, args) {
			return undefined;
		}
	};

	function parse() {
		grammar.yy = yyobj;
		return grammar.parse(input);
	}

	return parse;
}();
