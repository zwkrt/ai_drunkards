(function() {

	var totalIterations = 0;
	var totalStates = 0;
	var current = -Infinity;

	var fchcBest = -Infinity;
	var fchcIterations = 0;
	var fchcCurrent = 0;

	var saBest = -Infinity;
	var saReallyBest = -Infinity;
	var saIterations = 0;
	var saT = 1;

	var bestLinks = null;
	var bestCops = null;
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

	var redraw = function() {
	}

	var drawBest = function() {
		window.cops = bestCops;
		window.links = bestLinks;
	}

	var reset = function() {
		bestLinks = null;
		bestCops = null;
		totalIterations = 0;
		totalStates = 0;
		fchcBest = 0;
		current = 0;
		fchcIterations = 0;
		saBest = 0;
		current = 0;
		saIterations = 0;
		saT = 1;
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

	/*--------SA---------------*/
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


	window.FCHC = {}
	window.FCHC.generateSuccessor = successor;
	window.FCHC.evaluateState = evaluateState;
	window.FCHC.shouldTransition = fchcShouldTransition;
	window.FCHC.transitionState = fchcTransitionState;
	window.FCHC.isFinished = fchcIsFinished;
	window.FCHC.write = fchcWrite;

	window.SA = {}
	window.SA.generateSuccessor = successor;
	window.SA.evaluateState = evaluateState;
	window.SA.shouldTransition = saShouldTransition;
	window.SA.transitionState = saTransitionState;
	window.SA.isFinished = saIsFinished;
	window.SA.write = saWrite;

	window.algorithm_stuff = {}
	window.algorithm_stuff.reset = reset;

}())
