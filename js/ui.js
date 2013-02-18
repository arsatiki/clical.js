var global_scope = {};

function createMathElement(name) {
	var MATHML = "http://www.w3.org/1998/Math/MathML";
	return document.createElementNS(MATHML, name);
}
function createMathElementAndText(name, data) {
	var e = createMathElement(name);
	e.appendChild(document.createTextNode(data));
	return e;
}

function mn(n) { return createMathElementAndText("mn", n); }
function mo(op) { return createMathElementAndText("mo", op); }
function mi(id) { return createMathElementAndText("mi", id); }

function appendTerm(parent, coeff, bases) {
	var c, e, b, sub;
	
	if (coeff != 1 || bases.length == 0) {
		c = mn(coeff);
		parent.appendChild(c);
	}
	
	if (bases.length > 0) {
		e = mi("e");
		b = mn(bases);
		sub = createMathElement("msub");

		parent.appendChild(sub);
		sub.appendChild(e);
		sub.appendChild(b);
	}
}

function toMathML(variable, mv) {
	var k, t, c;
	var mvList = mv.outputFormat();

	var math = createMathElement("math");
	var mrow = createMathElement("mrow");
	math.appendChild(mrow);

	mrow.appendChild(mi(variable));
	mrow.appendChild(mo("="));

	for (k=0; k < mvList.length; k++) {
		t = mvList[k];

		if (k > 0) {
			c = t.abs_coefficient;
			mrow.appendChild(mo(t.sign));
		} else {
			c = t.coefficient;
		}
		appendTerm(mrow, c, t.dimensions.join(""));
	}

	return math;
}

function eval_input(input, env) {
	var ts = lookahead(lexer(input));
	return evalStatement(ts, env);
}

function handle_input(event) {
	var value = event.target.value;
	event.target.value = "";
	
	var item = $("<li/>");
	var entry = $("<kbd/>").append("> " + value);
	var variable = eval_input(value, global_scope);
	var output = toMathML(variable, global_scope[variable]);
	item.append(entry).append(output);

	$("#results").append(item);
	MathJax.Hub.Queue(["Typeset", MathJax.Hub, item.get(0)]);

	event.stopPropagation();
}

$(function () {
	$("#input").on("change", handle_input);
});