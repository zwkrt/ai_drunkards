#!/usr/bin/python

import json
import random
import sys

num_cops = 50;
num_drunks = 100;
num_bars = 10;
num_dead = 20;

def attach(a, b):
    '''
    Takes two node_id's and creates a link object between them
    with a random cost of 1-3

    '''
    return {"source":a, "target":b, "value":0,
            "sourceIndex":a, "targetIndex":b}


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


def make_costs(links):
    '''
    adds costs to the links

    '''
    for l in links:
        if l['value'] == 0:
            cost = random.randint(1,3)
            l['value'] = cost
            generator = (l2 for l2 in links if l2['source'] == l['target'] and l2['target'] == l['source'])
            for l2 in generator:
                l2['value'] = cost

def make_cops(n_list, cop_links):
    cop_nodes = []
    count = 0;
    for c in cop_links:
        source_x_coord = n_list[ c['source'] ]['x']
        source_y_coord = n_list[ c['source'] ]['y']
        target_x_coord = n_list[ c['target'] ]['x']
        target_y_coord = n_list[ c['target'] ]['y']

        x_coord = (source_x_coord + target_x_coord) / 2.0;
        y_coord = (source_y_coord + target_y_coord) / 2.0;
        cop_nodes.append({"name":count, "group": 4,
            "fixed": True, "x":x_coord, "y":y_coord,
            "source":c['source'], 'target':c['target'],
            })

        count += 1;

    return cop_nodes


def make_drunks(drunk_cnt, bar_nodes, n_list, dead_nodes):
    drunks = []
    count = 0
    while count < drunk_cnt:
        bar = random.sample(bar_nodes, 1)[0]
        goal = random.sample(n_list, 1)[0]['name']
        drunk = {'name': goal,
            'bar': bar,
            'goal': goal,
            'path': [],
            }
        if drunk['goal'] in dead_nodes:
            continue
        else:
            drunks.append(drunk)
            count += 1

    return drunks;


def main(width, height, pixels):
    '''
    Output JSON representing a randomized grid

    '''
    global num_cops
    global num_drunks
    global num_bars
    global num_dead

    special_nodes = random.sample(range(height*width), num_cops+num_bars);

    # These will be nodes with no incoming/outgoing connections,
    # just to make the graph interesting
    bar_nodes = special_nodes[:num_bars]

    # These nodes will be the starting points for all drunks
    dead_nodes = special_nodes[num_cops:]

    n_list = make_nodes(width, height, pixels, dead_nodes, bar_nodes)
    l_list = make_links(width, height, dead_nodes)

    # These links will be the starting positions for the cops
    cop_links = random.sample(l_list, num_cops)

    c_list = make_cops(n_list, cop_links)
    d_list = make_drunks(num_drunks, bar_nodes, n_list, dead_nodes)

    make_costs(l_list)
    graph = {"nodes": n_list,
             "links": l_list,
             "bars": bar_nodes,
             "cops":c_list,
             "drunks": d_list}

    print(json.dumps(graph))


def usage():
    print(
    '''
    Usage:

        $ ./makegraph w h p [> outfile.json]

    w: width of the graph in nodes
    h: height of the graph in nodes
    p: pixels between each node (50-75 is reasonable)

    Warning: will flood stdout if not redirected.

    '''
    )

if __name__=="__main__":

    if len(sys.argv) == 1:
        width, height, pixels = 10, 10, 60
        num_cops = 10
        num_drunks = 1000
        num_bars = 5
        num_dead = 5

    elif sys.argv[1] in ('-h', 'help', '--help', '?'):
        usage()

    else:
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
