(function() {

	var mainLoop = function() {
		var thisAlg = window.algorithm;

		if (thisAlg == null || thisAlg == undefined || thisAlg.isFinished()) {
			alert("Algorithm has finished.")
			return;
		}

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

		window.force.start();
		document.getElementById("status").value = thisAlg.write();
		setTimeout(mainLoop, 10);
	}

	window.mainLoop = mainLoop;

	var copTestingLoop = function() {
		window.graph.clearData();
		copName = Math.floor(Math.random()*10)
		window.graph.moveCopInGraph(copName);
		window.map.moveCopOnMap(copName);
		window.graph.calculateCosts();
		window.force.start();
		setTimeout(copTestingLoop, 500);
	};

	var initializeSimulation = function() {
		window.graph.initialize(window.force.nodes(), window.force.links(), cops, drunks, bars);
		document.getElementById("buttons").hidden = true;
		document.getElementById("status").disabled = "disabled";
		window.mainLoop();
	}

	window.initializeSimulation = initializeSimulation;

}())
