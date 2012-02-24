function swaps(items) {
	var i, j, minj;
	var cswaps = 0, smallest;
	
	for (i = 0; i < items.length; i++) {
		minj = i;
		for (j = i + 1; j < items.length; j++)
			if (items[j] < items[minj])
				minj = j;

		if (minj != i) {
			smallest = items[minj];
			items[minj] = items[i];
			items[i] = smallest;
			cswaps++;
		}
	}
	return (cswaps % 2 == 0)? 1 : -1;
}

exports.swaps = swaps;
