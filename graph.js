(function() {


	var initialize = function(nodes, links, cops, drunks) {
		var adj = {};
		for (var i in nodes) {
			adj[nodes[i].name] = [];
		}

		for (var i in links) {
			links[i].cop = null;
		}

		for (var i in nodes) {
			var nodeName = nodes[i].name;
			for (var j in links) {
				if (nodeName === links[j].source.name) {
					var linkObj = {};
					linkObj.node = links[j].target;
					linkObj.cost = links[j].value;
					adj[nodeName].push(linkObj);
				}
			}
		}

		for (var i in cops) {
			cops[i].links = [];

			for (var j in links) {
				if (cops[i].source == links[j].sourceIndex && cops[i].target == links[j].targetIndex) {
					links[j].cop = cops[i];
					cops[i].links.push(links[j]);
					//console.log("adding " + cops[i].source + ", " + cops[i].target);
				}
				if (cops[i].source == links[j].targetIndex && cops[i].target == links[j].sourceIndex) {
					links[j].cop = cops[i];
					cops[i].links.push(links[j]);
					//console.log("adding " + cops[i].target + ", " + cops[i].source);
				}
			}
		}

		//adding to global scope
		window.adj = adj;
		window.links = links;
		window.cops = cops;
		window.drunks = drunks;
	}

	var moveCopInGraph = function(copName) {
		//choose a cop (either by name or randomly)
		var randCop = null;
		if (copName === undefined || copName === null) {
			randCop = window.cops[Math.floor(Math.random() * cops.length)];
		}
		else {
			randCop = cops[copName]
		}

		//Choose a random link which has no cop on it
		var newLink = randCop.links[0];
		while (newLink.cop != null) {
			newLink = window.links[Math.floor(Math.random() * links.length)];
		}

		//Remove old links and their references back to this cop
		randCop.links[0].cop = null;
		randCop.links[1].cop = null;
		randCop.links = [];

		//Add the new links, and give them references to this cop
		randCop.links.push(newLink);
		for (var l in window.links) {
			if (window.links[l].source === newLink.target && window.links[l].target === newLink.source) {
				randCop.links.push(window.links[l]);
			}
		}
		randCop.links[0].cop = randCop;
		randCop.links[1].cop = randCop;

		return randCop.name;
	}

	var calculateCosts = function() {

	}

	graphObj = {}
	graphObj.initialize = initialize;
	graphObj.moveCopInGraph = moveCopInGraph;
	graphObj.calculateCosts = calculateCosts;
	window.graph = graphObj;

}())
