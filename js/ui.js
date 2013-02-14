function createMathElement(name) {
	var MATHML = "http://www.w3.org/1998/Math/MathML";
	return document.createElementNS(MATHML, name);
}


function createTermTree(parent, coeff, bases) {
	var c, e, b, sub;
	c = createMathElement("mn");
	e = createMathElement("mi");
	b = createMathElement("mn");
	sub = createMathElement("msub");
	
	c.appendChild(document.createTextNode(coeff));
	e.appendChild(document.createTextNode("e"))
	b.appendChild(document.createTextNode(bases));
	sub.appendChild(e);
	sub.appendChild(document.createTextNode(" "));
	sub.appendChild(b);

	parent.appendChild(c);
	parent.appendChild(document.createTextNode("&InvisibleTimes;"));
	parent.appendChild(sub);
}

function toMathML(mv) {
	var k, t;

	var NS = "";
	var math = createMathElement("math");
	var mrow = createMathElement("mrow");
	math.appendChild(mrow);
	
	for (k=0; k < mv.terms.length; k++) {
		t = mv.terms[k];
		createTermTree(mrow, t.coefficient, t.dimensions.join(""));
	}
	var li = document.createElement("li");
	li.appendChild(math);
	return li;
}

function lifmt(value, answer) {
	var input = $('<kbd />').append(value);
	var ansp = $('<output form="input" />').append("ans = " + answer);
	return $("<li/>").append(input).append(ansp);
	
}

function eval_input(event) {
	var value = event.target.value;
	event.target.value = "";

	/*var parsed = clicalparser.parse(value);*/

	/*$("#results").append(lifmt(value, parsed));*/
	$("#results").append(toMathML(v(1.0, 2.0, 3.0)));
	event.stopPropagation();
}

$(function () {
	$("#input").on("change", eval_input);
});