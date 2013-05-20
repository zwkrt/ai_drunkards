(function() {

	var totalIterations = 0;
	var totalStates = 0;
	var current = -Infinity;

	var fchcBest = -Infinity;
	var fchcIterations = 0;
	var fchcCurrent = 0;

	var currentCop = null;

	var successor = function() {
		window.graph.clearData();
		worstCop = -1;
		worstSum = Infinity;
		currentCop = window.graph.moveCopInGraph(currentCop);
		totalStates++;
		fchcIterations++;
	}

	var fchcWrite = function() {
		return  "Transitions: " + totalIterations +
			"\nStates Processed: " + totalStates +
			"\nBest Config: " + fchcBest + " drunks caught" +
			"\nCurrent Config: " + fchcCurrent + " drunks caught"
	}


	var evaluateState = function() {
		window.graph.calculateCosts();

		var sum = 0;
		for (var c in cops) {
			sum += cops[c].links[0].drunkCount;
			sum += cops[c].links[1].drunkCount;
		}

		current = sum;
		return sum;
	}
	var fchcShouldTransition = function(number) {
		fchcCurrent = number;
		if (fchcBest <= number) {
			return true;
		}
		else {
			return false;
		}

	}

	var fchcTransitionState = function() {
		window.map.moveCopOnMap(currentCop);
		currentCop = null;
		fchcBest = current;
		fchcIterations = 0;
		totalIterations++;
	}

	var fchcIsFinished = function() {
		if (fchcIterations > 500) {
			return true;
		}
		else {
			return false;
		}
	}

	window.FCHC = {}
	window.FCHC.generateSuccessor = successor;
	window.FCHC.evaluateState = evaluateState;
	window.FCHC.shouldTransition = fchcShouldTransition;
	window.FCHC.transitionState = fchcTransitionState;
	window.FCHC.isFinished = fchcIsFinished;
	window.FCHC.write = fchcWrite;

}())
