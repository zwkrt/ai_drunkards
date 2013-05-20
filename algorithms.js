(function() {

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



	window.algorithmStuff = {}
	window.algorithmStuff.reset = reset;
	window.algorithmStuff.drawBest = drawBest;

}())
