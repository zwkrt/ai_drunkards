(function() { // A dirty hack used to keep stuff in file scope
	//see http://lupomontero.com/using-javascript-closures-to-create-private-scopes/

	// in pixels
	var width = 1000;
	var height = 750;

	var colors = [ null, "#1f77b4", "#aec7e8", "#ff7f03", "#8c1919"];

	//the object containing all drawable objects
	var force = d3.layout.force()
	.linkDistance(50)
	.size([width, height]);

	var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

	//parse data from map.json, call it "graph"
	d3.json("map.json", function(error, graph) {
		force
		.nodes(graph.nodes)
		.links(graph.links)
		.start();

		//create a line for every 'link' in the graph json object
		var link = svg.selectAll(".link")
		.data(graph.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) {return Math.pow(d.value, 1.2) });

		//create a circular node for every 'node' in the graph json object
		var node = svg.selectAll(".node")
		.data(graph.nodes)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", function(d) { if (graph.bars.indexOf(d.name) >= 0) { return 10 } else { return 5}})
		.style("fill", function(d) { return colors[d.group]; });

	   	var cop = svg.selectAll(".cop")
		.data(graph.cops)
		.enter().append("circle")
		.attr("class", "cops")
		.attr("r", function(d) { return 5; } )
		.style("fill", function(d) { return colors[4];});

		//This is the update function that gets called on every screen redraw
		force.on("tick", function() {
			link
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

			node
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

			cop
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });
		});
		window.force = force;
		window.graph.initialize(force.nodes(), force.links(), null, null);
	});

	// exporting force to the global scope.
	// Other files will use "window.force" to access this object


}());
