#!/usr/bin/python

import json
import random
import sys


def attach(a, b):
    '''
    Takes two node_id's and creates a link object between them
    with a random cost of 1-3

    '''
    cost = random.randint(1,3)
    return {"source":a, "target":b, "value":cost}


def make_links(w, h, dead_nodes):
    '''
    Create all links between nodes on a rectangular grid of
    height h and width w. Dead nodes have no links.

    '''
    edges = []
    generator = (n for n in range(w*h) if n not in dead_nodes)
    for n in generator:
        if n >= w and n-w not in dead_nodes:
            edges.append((attach(n, n-w)))
        if n < (w*h - w) and n+w not in dead_nodes:
            edges.append((attach(n, n+w)))
        if n % w != 0 and n-1 not in dead_nodes:
            edges.append((attach(n, n-1)))
        if n % w != w-1 and n+1 not in dead_nodes:
            edges.append((attach(n, n+1)))
    return edges


def make_nodes(w, h, px, dead_nodes, bars):
    '''
    Create all node objects for a rectangular grid of size w*h.
    Dead nodes and bars are given different group numbers.

    '''
    nodes = []
    for n in range(w*h):
        group = 1
        x_coord = (n%w * px + 10)
        y_coord = (n//w % w * px + 10)

        if n in dead_nodes:
            group = 2
        if n in bars:
            group = 3

        nodes.append({"name":n, "group": group,
                      "fixed": True, "x":x_coord, "y":y_coord
                     })

    return nodes


def main(width, height, pixels):
    '''
    Output JSON representing a randomized grid

    '''
    special_nodes = random.sample(range(height*width), 30)

    # These will be nodes with no incoming/outgoing connections,
    # just to make the graph interesting
    bar_nodes = special_nodes[:10]

    # These nodes will be the starting points for all drunks
    dead_nodes = special_nodes[10:]

    n_list = make_nodes(width, height, pixels, dead_nodes, bar_nodes)
    l_list = make_links(width, height, dead_nodes)
    graph = {"nodes": n_list, "links": l_list, "bars": bar_nodes}
    print(json.dumps(graph))


def usage():
    print(
    '''
    Usage:

        $ ./makegraph w h p [> outfile.json]

    w: width of the graph in nodes
    h: height of the graph in nodes
    p: pixels between each node (50 is reasonable)

    Warning: will flood stdout if not redirected.

    '''
    )

if __name__=="__main__":

    try:
        width, height, pixels = sys.argv[1:4]
        width = int(width)
        height = int(height)
        pixels = int(pixels)
    except Exception as ex:
        usage()
        print(ex)
        sys.exit()

    main(width, height, pixels)
