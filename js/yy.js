var yy = function(){
	var yyobj = {
		assignment: function (identifier, exp) {},
		identifier: function (name) {},

		negate: function (exp) {},
		conjugate: function (exp) {},
		involute: function (exp) {},

		add: function(exp1, exp2) {},
		subtract: function(exp1, exp2) {},
		power: function(exp1, exp2) {},
		outerPower: function(exp1, exp2) {},
		multiply: function(exp1, exp2) {},
		innerProduct: function(exp1, exp2) {},
		outerProduct: function(exp1, exp2) {},
		div: function(exp1, exp2) {},
		backdiv: function(exp1, exp2) {},

		funcall: function(name, args) {}
	};
	
	return yyobj;
}();
exports.yy = yy;