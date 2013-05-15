(function() {

	var totalIterations;
	var totalStates

	var fchcBest = -Infinity;
	var fchcCurrent = -Infinity;
	var fchcIterations = 0;

	var saBest = -Infinity;
	var saCurrent = -Infinity;
	var saIterations = 0;
	var saT = 1;

	var bestLinks = null;
	var bestCops = null;

	var successor = function() {
		var copName = graph.moveCopInGraph();
		map.moveCopOnMap(copName);
	}


	var evaluateState = function() {
		var sum = 0;

		for (var c in cops) {
			sum += cops[c].links[0].drunkCount;
			sum += cops[c].links[1].drunkCount;
		}

		return sum;
	}

	var redraw = function() {
		window.force.start();
		window.force.tick();
		window.force.stop();
	}

	var drawBest = function() {
		window.cops = bestCops;
		window.links = bestLinks;
		window.force.start();
		window.force.tick();
		window.force.stop();
	}

	var reset = function() {
		bestLinks = null;
		bestCops = null;
		totalIterations = 0;
		totalStates = 0;
		fchcBest = 0;
		fchcCurrent = 0;
		fchcIterations = 0;
		saBest = 0;
		saCurrent = 0;
		saIterations = 0;
		saT = 1;
	}

	var fchcShouldTransition = function(number) {
		return (fchcBest < number)
	}

	var fchcTransitionState = function() {
		fchcBest = fchcCurrent;
		fchcIterations = 0;
		setTimeout(redraw, 500);
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
		if (saBest < number) {
			saBest = number;
			return true;
		}
		else {
			if (saT < Math.random()) {
				return true;
			}
			else {
				return false;
			}
		}
	}

	var saTransitionState = function() {
		saT = saT*0.999;
		setTimeout(redraw, 500);
	}

	var saIsFinished = function() {
		return saT < .0000001
	}


	window.FCHC = {}
	window.FCHC.generateSuccessor = successor;
	window.FCHC.evaluateState = evaluateState;
	window.FCHC.shouldTransition = fchcShouldTransition;
	window.FCHC.transitionState = fchcTransitionState;
	window.FCHC.isFinished = fchcIsFinished;
	window.FCHC.best = fchcBest;
	window.FCHC.iterations = totalIterations;
	window.FCHC.states = totalStates;

	window.SA = {}
	window.SA.generateSuccessor = successor;
	window.SA.evaluateState = evaluateState;
	window.SA.shouldTransition = saShouldTransition;
	window.SA.transitionState = saTransitionState;
	window.SA.isFinished = saIsFinished;
	window.SA.best = saBest;
	window.SA.iterations = totalIterations;
	window.SA.states = totalStates;

	window.algorithm_stuff = {}
	window.algorithm_stuff.reset = reset;

}())
