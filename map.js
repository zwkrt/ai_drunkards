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

	var cops = [];
	var drunks = [];

	var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

	//parse data from map.json, call it "graph"
	d3.json("map.json", function(error, mapData) {

		cops = mapData.cops;
		drunks = mapData.drunks;
		bars = mapData.bars;

		force
		.nodes(mapData.nodes)
		.links(mapData.links)
		.start();

		//create a line for every 'link' in the mapData json object
		var linkSelection = svg.selectAll(".link")
		.data(mapData.links)
		.enter().append("line")
		.attr("class", "link")
		.style("stroke-width", function(d) {return d.value });

		//create a circular node for every 'node' in the mapData json object
		var nodeSelection = svg.selectAll(".node")
		.data(mapData.nodes)
		.enter().append("circle")
		.attr("class", "node")
		.attr("r", function(d) { if (mapData.bars.indexOf(d.name) >= 0) { return 10 } else { return 5}})
		.style("fill", function(d) { return colors[d.group]; });

		//create a circular node for every cop.
	   	var copSelection = svg.selectAll(".cop")
		.data(mapData.cops)
		.enter().append("circle")
		.attr("class", "cops")
		.attr("r", function(d) { return 8; } )
		.style("fill", function(d) { return colors[4];});

		//Static drawing. These do not change
		linkSelection
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

		nodeSelection
		.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });


		//This is the update function that gets called on every screen redraw
		force.on("tick", function() {
			copSelection
			.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

			colorLinks();
		});

		window.linkSel = linkSelection;
		window.force = force
		window.cops = cops
		window.drunks = drunks
		window.bars = bars
		window.initializeSimulation();
	});

	var moveCopOnMap = function(copName) {
		//This function assumes the cop has already been moved in the adj list

	   	var movedCop = window.cops[copName];

		//Figure out where the link is
		var source_x_coord = movedCop.links[0].source.x;
		var source_y_coord = movedCop.links[0].source.y;
		var target_x_coord = movedCop.links[0].target.x;
		var target_y_coord = movedCop.links[0].target.y;

		//Midpoint formula on the link ends
		movedCop.x = (source_x_coord + target_x_coord) /2.0;
		movedCop.y = (source_y_coord + target_y_coord) /2.0;

		return copName;
	}

	var colorLinks = function() {
		for (var d in drunks) {
			for (var l in drunks[d].path) {
				drunks[d].path[l].drunkCount++;
			}
		}

		linkSel.style("stroke", function(d) {
			var numDrunks = d.drunkCount;
			var minusValue = Math.min(255, numDrunks*80);
			return "rgb(" + (255-minusValue) + "," + (255-minusValue) + "," + (255/*-minusValue*/) + ")";
		});
	}

	var copTestingLoop = function() {
		window.graph.clearData();
		window.graph.calculateCosts();
		force.start();
		copName = Math.floor(Math.random()*10)
		window.graph.moveCopInGraph(copName);
		moveCopOnMap(copName);
		setTimeout(copTestingLoop, 500);
	};

	window.map = {};
	window.map.moveCopOnMap = moveCopOnMap;
	window.copTestingLoop = copTestingLoop;

}())
