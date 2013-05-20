(function() {
	var totalIterations = 0;
	var totalStates = 0;
	var current = -Infinity;

	var saBest = -Infinity;
	var saReallyBest = -Infinity;
	var saIterations = 0;
	var saT = 1;
	var currentCop = null;

	var successor = function() {
		window.graph.clearData();
		worstCop = -1;
		worstSum = Infinity;
		currentCop = window.graph.moveCopInGraph(currentCop);
		totalStates++;
	}

	var saWrite = function() {
		return  "Transitions: " + totalIterations +
			"\nStates Processed: " + totalStates +
			"\nBest Config: " + saReallyBest + " drunks caught" +
			"\nCurrent Config: " + saBest + " drunks caught" +
			"\nTemperature: " + saT
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

	var saShouldTransition = function(number) {
		if (saBest <= number) {
			return true;
		}
		else {
			var prob = Math.pow(Math.E, -(number/saBest)/saT);

			if (prob > Math.random()) {
				return true;
			}
			else {
				return false;
			}
		}
		currentCop = null;
	}

	var saTransitionState = function() {
		window.map.moveCopOnMap(currentCop);
		currentCop = null;
		saBest = current;
		if (saBest > saReallyBest) {
			saReallyBest = saBest;
		}
		saT = saT*0.99;
		saIterations++;
		totalIterations++;
	}

	var saIsFinished = function() {
		return saT < .00001
	}

	window.SA = {}
	window.SA.generateSuccessor = successor;
	window.SA.evaluateState = evaluateState;
	window.SA.shouldTransition = saShouldTransition;
	window.SA.transitionState = saTransitionState;
	window.SA.isFinished = saIsFinished;
	window.SA.write = saWrite;

}())

