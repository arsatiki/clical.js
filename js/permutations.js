function cmp(a, b) { return a - b; }

function same_parity(items, target) {
	var k;
	var f = {};
	var seen = {};
	var even_cycles = 0;

	for (k = 0; k < items.length; k++)
		f[target[k]] = items[k];

	for (k = 0; k < items.length; k++) {
		if (items[k] in seen)
			continue;

		var c = items[k];
		var cycle_length = 0;
		while (!(c in seen)) {
			seen[c] = true;
			cycle_length++;
			c = f[c];
		}

		even_cycles += (cycle_length - 1) % 2;
	}

	return (even_cycles % 2 == 0)? 1: -1;
}

function parity(items) {
	var sorted = items.slice(0).sort(cmp);
	return same_parity(items, sorted);
}

exports.parity = parity;
