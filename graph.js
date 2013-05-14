(function() {


	var initialize = function(nodes, links, cops, drunks) {
		var adj = {};
		for (var i in nodes) {
			adj[nodes[i].name] = [];
		}

		for (var i in links) {
			links[i].copsList = [];
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
					links[j].copsList.push(cops[i]);
					cops[i].links.push(links[j]);
					//console.log("adding " + cops[i].source + ", " + cops[i].target);
				}
				if (cops[i].source == links[j].targetIndex && cops[i].target == links[j].sourceIndex) {
					links[j].copsList.push(cops[i]);
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

	var moveCop = function(copName) {
		randCop = null;
		if (copName === undefined || copName === null) {
			randCop = window.cops[Math.floor(Math.random() * cops.length)];
		}
		else {
			randCop = cops[copName]
		}
		randLink = window.links[Math.floor(Math.random() * links.length)];

	}

	var calculateCosts = function() {

	}

	graphObj = {}
	graphObj.initialize = initialize;
	graphObj.moveCop = moveCop;
	graphObj.calculateCosts = calculateCosts;
	window.graph = graphObj;

}())
