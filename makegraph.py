#!/usr/bin/python

import json
import random

height = 15
width = 20
px = 50
py = 50

dead_nodes = random.sample(range(height*width), 20)
bars = random.sample(range(height*width), 10)

def attach(a, b):
    cost = random.randint(1,4)
    return {"source":a, "target":b, "value":cost}


def make_edges(w, h):
    global dead_nodes
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


def make_nodes(w, h):
    global dead_nodes
    global bars
    global px
    global py
    nodes = []
    for n in range(w*h):
        group = 1
        x_coord = (n%w * px + 1)
        y_coord = (n//w % w * py + 1)

        if n in bars:
            group = 3
        if n in dead_nodes:
            group = 2
            if n in bars:
                bars.remove(n)
        if n == 0:
            x, y = 1, 1

        nodes.append({"name":n, "group": group,
                      "fixed":True, "x":x_coord, "y":y_coord
                     })

    return nodes

def write():
    global width
    global height
    global bars
    with open("map2.json", 'w') as f:
        n = make_nodes(width, height)
        e = make_edges(width, height)
        obj = {"nodes": n, "links": e, "bars": bars}
        f.write(json.dumps(obj, indent=2, sort_keys=True))

if __name__=="__main__":
    write()
