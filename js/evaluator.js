var evaluator = function() {
	var global_scope = {};

	function looksLikeBase(identifier) {
		return /e\d+/.test(identifier);
	}
	function parseBase(base) {
		var k, b = [];
		for (k=1; k < base.length; k++) {
			sub = base.substring(k, k+1);
			b.push(parseInt(sub));
		}
		return b;
	}

	var yyobj = {
		assignment: function (identifier, exp) {
			global_scope[identifier] = exp;
			return {'var': identifier, 'val': exp};
		},
		identifier: function (name) {
			if (looksLikeBase(name))
				return e(parseBase(name));
			
			return global_scope[name];
		},
		number: function(n) {
			return s(parseFloat(n));
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
			return exp1.mult(exp2);
		},
		innerProduct: function(exp1, exp2) {
			return exp1.dot(exp2);
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

	function parse(input) {
		grammar.yy = yyobj;
		return grammar.parse(input);
	}

	return parse;
}();
