(function() {

	var mainLoop = function() {
		var thisAlg = window.algorithm;

		while (!thisAlg.isFinished()) {
			//If the alg changed out from under us
			if (window.algorithm != thisAlg) {
				window.algorithm_stuff.reset();
				thisAlg = window.algorithm;
			}

			//run the algorithm, transitioning when appropriate
			thisAlg.generateSuccessor();
			var score = thisAlg.evaluateState();
			if (thisAlg.shouldTransition(score)) {
				thisAlg.transitionState();
			}
		}
		alert("Algorithm has finished. Total number of drunks caught: " + thisAlg.best)
	}

	window.mainLoop = mainLoop;

	var initializeSimulation = function() {
		window.graph.initialize(window.force.nodes(), window.force.links(), cops, drunks, bars);
		window.algorithm = window.FCHC;
		window.copTestingLoop();
	}

	window.initializeSimulation = initializeSimulation;

}())
