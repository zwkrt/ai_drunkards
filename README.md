ai\_drunkards
============

A small interactive AI demonstration using d3.js

Some things to note:
--------------------

* Both index.html and map.json must be hosted by a web server to work properly.
  If you have python2, running `python2 -m SimpleHTTPServer` and then accessing
  the site at `http://localhost:8000/index.html` should be sufficient.

* makegraph.py must be run with the output saved to map.json before attempting
  to access the site: `./makegraph.py 20 15 50 > map.json` will produce a
  sensible graph.

* The developer console of chrome is avaliable by keying CTLR-Shift-I, and then
  clicking on the "Show Console." button on the bottom (second to the left).
  Also, it is probably helpful to disable the cache, because the cache only
  causes pain and strife.

Checklist of things to do:
---------------------

1. Create an adjacency-list representation of the nodes and links.
1. Initialize a medium-large number of drunkards and give them destinations
1. Implement A\* so the drunkards know how to get to their destinations
1. Create a fixed number of cops
1. Create the data structures necessary to remember cops' locations
1. Visually represent the cops
1. Visually represent the drunkards paths
1. Implement a number of hill-climbing algorithms for cop placement
1. (Maybe) implement the silly algorithm described in my paper
1. Create a GUI to allow users to select which algorithm they want
1. (Maybe) allow users to randomize the graph
1. (Maybe) randomize the graph on page-load

Current List of problems:
-------------------

* The data structure for drawing the nodes and links is unsatisfying: Nodes are
  kept in an array, and links connect nodes by indexing the nodes in the array
  (as opposed to having references to their objects or locations). This might be
  problematic, and may mean we need to store the data about the graph in two
  separate places: one for the drawing, and one for the searching.

* Drunkard pathfinding might be prohibitively expensive. Naively, we would need
  to run A\* on every drunkard every time we consider moving a single officer. If
  this is a problem, then we can be picky about what drunkards actually need to
  be re-evaluated.
