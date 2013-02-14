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
	c = mn(coeff);
	e = mi("e");
	b = mn(bases);
	sub = createMathElement("msub");
	
	sub.appendChild(e);
	sub.appendChild(b);

	parent.appendChild(c);
	parent.appendChild(document.createTextNode("&InvisibleTimes;"));
	parent.appendChild(sub);
}

function toMathML(mv) {
	var k, t, c, combining_op;

	var NS = "";
	var math = createMathElement("math");
	var mrow = createMathElement("mrow");
	math.appendChild(mrow);
	
	for (k=0; k < mv.terms.length; k++) {
		t = mv.terms[k];
		c = t.coefficient;
		if (k > 0) {
			combining_op = '+';
			if (c < 0) {
				c = -c;
				combining_op = "-";
			}
			mrow.appendChild(mo(combining_op));
		}
		appendTerm(mrow, c, t.dimensions.join(""));
	}

	return math;
}

function formatAnswer(answer) {
	var li = document.createElement("li");
	li.appendChild(toMathML(answer));
	return li;
}

function eval_input(event) {
	var value = event.target.value;
	event.target.value = "";

	$("#results").append(formatAnswer(v(-1, -2, 3)));
	event.stopPropagation();
}

$(function () {
	$("#input").on("change", eval_input);
});