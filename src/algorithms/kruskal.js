import { DEFAULT_WEIGHTED_GRAPH, edgeKey, randomizeWeightedGraph } from './defaultWeightedGraph.js';

class UnionFind {
  constructor(ids) {
    this.parent = Object.fromEntries(ids.map((id) => [id, id]));
    this.rank = Object.fromEntries(ids.map((id) => [id, 0]));
  }
  find(x) {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(x, y) {
    const px = this.find(x), py = this.find(y);
    if (px === py) return false;
    if (this.rank[px] < this.rank[py]) this.parent[px] = py;
    else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
    else { this.parent[py] = px; this.rank[px]++; }
    return true;
  }
  connected(x, y) { return this.find(x) === this.find(y); }
}

function* kruskalGenerator({ nodes, edges }) {
  const sorted = [...edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(nodes.map((n) => n.id));
  const mstEdges = new Set();
  const rejectedEdges = new Set();
  let totalWeight = 0;

  yield {
    mstEdges: new Set(mstEdges),
    rejectedEdges: new Set(rejectedEdges),
    examineEdge: null,
    current: null,
    examining: null,
    totalWeight,
    type: 'init',
    description: `Sort all ${sorted.length} edges by weight: ${sorted.map((e) => `${e.from}-${e.to}(${e.weight})`).join(', ')}.`,
  };

  for (const edge of sorted) {
    const key = edgeKey(edge.from, edge.to);

    yield {
      mstEdges: new Set(mstEdges),
      rejectedEdges: new Set(rejectedEdges),
      examineEdge: key,
      current: edge.from,
      examining: edge.to,
      totalWeight,
      type: 'examine',
      description: `Consider edge ${edge.from}–${edge.to} (w=${edge.weight}). Are ${edge.from} and ${edge.to} in the same component? ${uf.connected(edge.from, edge.to) ? 'Yes → reject (would create cycle).' : 'No → accept.'}`,
    };

    if (uf.union(edge.from, edge.to)) {
      mstEdges.add(key);
      totalWeight += edge.weight;

      yield {
        mstEdges: new Set(mstEdges),
        rejectedEdges: new Set(rejectedEdges),
        examineEdge: null,
        current: null,
        examining: null,
        totalWeight,
        type: 'accept',
        description: `Accepted ${edge.from}–${edge.to} (w=${edge.weight}). MST edges so far: ${mstEdges.size}/${nodes.length - 1}. Total weight: ${totalWeight}.`,
      };

      if (mstEdges.size === nodes.length - 1) break;
    } else {
      rejectedEdges.add(key);

      yield {
        mstEdges: new Set(mstEdges),
        rejectedEdges: new Set(rejectedEdges),
        examineEdge: null,
        current: null,
        examining: null,
        totalWeight,
        type: 'reject',
        description: `Rejected ${edge.from}–${edge.to} (w=${edge.weight}) — creates a cycle.`,
      };
    }
  }

  yield {
    mstEdges: new Set(mstEdges),
    rejectedEdges: new Set(rejectedEdges),
    examineEdge: null,
    current: null,
    examining: null,
    totalWeight,
    type: 'done',
    description: `MST complete. Edges: {${[...mstEdges].join(', ')}}. Total weight: ${totalWeight}.`,
  };
}

export function generateKruskalSteps(input) {
  const steps = [];
  for (const step of kruskalGenerator(input)) steps.push(step);
  return steps;
}

export { DEFAULT_WEIGHTED_GRAPH as DEFAULT_KRUSKAL_GRAPH };

export function randomizeKruskalGraph() {
  const g = randomizeWeightedGraph();
  const { startNode: _, ...rest } = g;
  return rest;
}