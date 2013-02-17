/* Wrap a token generator with a lookahead shim. */
function lookahead(f) {
	var newf = function() {
		var value = newf.peek;
		newf.peek = f();
		return value;
	};
	newf();
	return newf;
}

function matchToken(ts, tokentype, value) {
	var t = ts();
	if (tokentype != t.name)
		return false;
	if (value !== undefined && value !== t.value)
		return false;
	return true;
}

function parseBase(ts) {
	var k, b = [], base ="", sub;
	if (ts.peek.name == "BASISVECTOR")
		base = ts().value;

	for (k=1; k < base.length; k++) {
		sub = base.substring(k, k+1);
		b.push(parseInt(sub));
	}
	return b;
}

function parseCoefficient(ts) {
	if (ts.peek.name == "NUMBER")
		return parseFloat(ts().value);
	if (ts.peek.name == "BASISVECTOR")
		return 1;
	return undefined;
}

function parseFactor(ts, env) {
	var t, c, b;
	var k;

	if (ts.peek.name == "IDENTIFIER") {
		t = ts();
		return env[t.value];
	}

	c = parseCoefficient(ts);
	b = parseBase(ts);
	
	/* TODO: The API for new Multivectors is shite */
	return new Multivector([new Term(c, b)]);
}

function parseUnary(ts, env) {
	var op = ts();
	console.log("Parsing unary", op.value);
	var rest = evalExpression(ts, env);
	return op.value == '+'? rest: rest.neg();
}

function evalExpression(ts, env, left) {
	var right;
	console.log(ts.peek);

	if (ts.peek.name == "OPERATOR")
		return parseUnary(ts, env);

	left = left || parseFactor(ts, env);

	if (ts.peek.name == "EOF")
		return left;
	
	switch (ts.peek.value) {
		case "+":
			matchToken(ts, "OPERATOR", "+");
			right = evalExpression(ts, env);
			return left.plus(right);
		break;
		
		case "-":
			matchToken(ts, "OPERATOR", "-");
			right = evalExpression(ts, env);
			return left.minus(right);
		break;
	}
}

function evalStatement(ts, env) {
	var t, ans;
	if (ts.peek.name == "IDENTIFIER") {
		t = ts();

		if (ts.peek.name == "OPERATOR" && ts.peek.value == "=") {
			matchToken(ts, "OPERATOR", "=");
			env[t.value] = evalExpression(ts, env);
			return t.value;
		}
		ans = evalExpression(ts, env, env[t.value]);
	} else {
		ans = evalExpression(ts, env);
	}
	env['ans'] = ans;
	return 'ans';
}
