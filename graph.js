(function() {

	var initialize = function(nodes, links, cops, drunks, bar_indexes) {
		// Instantiate Adjacency list entries
		var adj = {};
		for (var i in nodes) {
			nodes[i].shortestToHere = null;
			nodes[i].currentBar = null;
			adj[nodes[i].name] = [];
		}

		// Create Bars
		var bars = [];
		for (var i in nodes) {
			if (bar_indexes.indexOf(nodes[i].name) >= 0) {
				bars.push(nodes[i]);
			}
		}

		//Create Drunks
		for (var i in drunks) {
			for (var j in nodes) {
				if (drunks[i].bar === nodes[j].index) {
					drunks[i].bar = nodes[j];
				}
				if (drunks[i].goal === nodes[j].index) {
					drunks[i].goal = nodes[j];
				}
			}
		}

		// Create references to reverse links (i.e., 56->46 and 46->56)
		for (var i in links) {
			links[i].cop = null;
			links[i].drunkCount = 0;
			links[i].cost = links[i].value;
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
					links[j].reverse.cop = cops[i];
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
		window.nodes = nodes;
		window.bars = bars;
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
		randCop.links[0].cost = randCop.links[0].value
		randCop.links[1].cost = randCop.links[1].value
		randCop.links[0].cop = null;
		randCop.links[1].cop = null;
		randCop.links = [];

		//Add the new links, and give them references to this cop
		randCop.links.push(newLink);
		randCop.links.push(newLink.reverse);
		randCop.links[0].cop = randCop;
		randCop.links[1].cop = randCop;
		randCop.links[0].cost = randCop.links[0].value * 2
		randCop.links[1].cost = randCop.links[1].value * 2

		return randCop.name;
	}

	//Dijkstra's algorithm
	var calculateCosts = function() {
		for (b in bars) {
			var bar = bars[b];
			var mheap = new MinHeap(null, function(n1, n2) {
				var c1 = n1.shortestToHere;
				var c2 = n2.shortestToHere;
				return c1 == c2 ? 0 : c1 > c2 ? 1 : -1;
			});
			nodes[bar.name].shortestToHere = 0;
			mheap.insert(nodes[bar.name])

			while (mheap.size() > 0) {
				var currentNode = mheap.pop();
				if (currentNode.currentBar != bar) {
					currentNode.currentBar = bar;
				}
				var conns = adj[currentNode.name];
				for (var l in conns) {
					var nnode = conns[l].target;
					if (nnode.currentBar != bar) nnode.finished = false;
					if (nnode.finished) continue;

					nnode.shortestToHere = currentNode.shortestToHere + conns[l].cost;
					nnode.linkToHere = conns[l];
					mheap.push(nnode);
				}
				currentNode.finished = true;
			}

			for (var d in window.drunks) {
				if (drunks[d].bar != bar) continue;
				drunks[d].path = [];
				var endNode = drunks[d].goal;
				var startNode = drunks[d].bar;
				while (startNode != endNode) {
					drunks[d].path.push(endNode.linkToHere);
					endNode = endNode.linkToHere.source;
				}
			}

			for (var d in drunks) {
				for (var l in drunks[d].path) {
					drunks[d].path[l].drunkCount++;
				}
			}
		}
	}

	var clearData = function() {
		for (var d in drunks) {
			drunks[d].path = [];
		}
		for (var l in links) {
			links[l].drunkCount = 0;
		}
		for (var n in nodes) {
			nodes[n].linkToHere = null;
			nodes[n].currentBar = null;
			nodes[n].shortestToHere = null;
		}
	}

	graphObj = {}
	graphObj.initialize = initialize;
	graphObj.moveCopInGraph = moveCopInGraph;
	graphObj.calculateCosts = calculateCosts;
	graphObj.clearData = clearData;
	window.graph = graphObj;

}())
