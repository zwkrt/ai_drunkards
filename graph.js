(function() {


	var initialize = function(nodes, links, cops, drunks) {
		var adj = {};
		for (var i in nodes) {
			adj[nodes[i].name] = [];
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
		//adding to global sc
		window.adj = adj;
	}

	var moveCop = function(cop) {

	}

	var calculateCosts = function() {

	}

	graphObj = {}
	graphObj.initialize = initialize;
	graphObj.moveCop = moveCop;
	graphObj.calculateCosts = calculateCosts;
	window.graph = graphObj;

}())
