(function() {


	var initialize = function(nodes, links, cops, drunks) {
		// Instantiate Adjacency list entries
		var adj = {};
		for (var i in nodes) {
			adj[nodes[i].name] = [];
		}

		// Create references to reverse links (i.e., 56->46 and 46->56)
		for (var i in links) {
			links[i].cop = null;
			links[i].drunkCount = 0;
			for (var j in links) {
				if (links[i].target === links[j].source && links[i].source === links[j].target) {
					links[i].reverse = links[j];
					links[j].reverse = links[i];
				}
			}
		}

		// Create Adjacency list entries
		for (var i in nodes) {
			var nodeName = nodes[i].name;
			for (var j in links) {
				if (nodeName === links[j].source.name) {
					adj[nodeName].push(links[j]);
				}
			}
		}

		//Add Cop references to links
		for (var i in cops) {
			cops[i].links = [];

			for (var j in links) {
				if (cops[i].source == links[j].sourceIndex && cops[i].target == links[j].targetIndex) {
					links[j].cop = cops[i];
					cops[i].links.push(links[j]);
					cops[i].links.push(links[j].reverse);
					delete links[j].sourceIndex;
					delete links[j].targetIndex;
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
		randCop.links.push(newLink.reverse);
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
