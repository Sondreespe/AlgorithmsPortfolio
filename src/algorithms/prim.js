import { DEFAULT_WEIGHTED_GRAPH, edgeKey, buildWeightedAdjacency, randomizeWeightedGraph } from './defaultWeightedGraph.js';

function* primGenerator({ nodes, edges, startNode }) {
  const adj = buildWeightedAdjacency(nodes, edges);
  const inMST = new Set([startNode]);
  const mstEdges = new Set();
  let totalWeight = 0;

  // key[v] = cheapest edge weight to reach v from MST; parent[v] = MST node connecting to v
  const key = Object.fromEntries(nodes.map((n) => [n.id, Infinity]));
  const parent = {};
  key[startNode] = 0;

  // frontier: nodes reachable from MST but not yet included
  const frontier = new Set();
  for (const { to: nb, weight } of adj[startNode]) {
    if (key[nb] > weight) {
      key[nb] = weight;
      parent[nb] = startNode;
      frontier.add(nb);
    }
  }

  yield {
    inMST: new Set(inMST),
    mstEdges: new Set(mstEdges),
    frontier: new Set(frontier),
    examineEdge: null,
    current: null,
    examining: null,
    totalWeight,
    type: 'init',
    description: `Initialize: add node ${startNode} to MST. Update cheapest edges to neighbors: ${[...frontier].map((v) => `${v}(${key[v]})`).join(', ')}.`,
  };

  while (frontier.size > 0) {
    // Pick minimum-key node from frontier
    let u = null;
    let minKey = Infinity;
    for (const v of frontier) {
      if (key[v] < minKey) { minKey = key[v]; u = v; }
    }

    yield {
      inMST: new Set(inMST),
      mstEdges: new Set(mstEdges),
      frontier: new Set(frontier),
      examineEdge: edgeKey(parent[u], u),
      current: parent[u],
      examining: u,
      totalWeight,
      type: 'pick',
      description: `Cheapest cut edge: ${parent[u]}–${u} (w=${key[u]}). Add ${u} to MST.`,
    };

    frontier.delete(u);
    inMST.add(u);
    mstEdges.add(edgeKey(parent[u], u));
    totalWeight += key[u];

    yield {
      inMST: new Set(inMST),
      mstEdges: new Set(mstEdges),
      frontier: new Set(frontier),
      examineEdge: null,
      current: u,
      examining: null,
      totalWeight,
      type: 'add',
      description: `Added ${u}. MST edges: ${mstEdges.size}/${nodes.length - 1}. Total weight: ${totalWeight}.`,
    };

    for (const { to: v, weight } of adj[u]) {
      if (inMST.has(v)) continue;

      yield {
        inMST: new Set(inMST),
        mstEdges: new Set(mstEdges),
        frontier: new Set(frontier),
        examineEdge: edgeKey(u, v),
        current: u,
        examining: v,
        totalWeight,
        type: 'examine',
        description: `Edge ${u}–${v} (w=${weight}): ${weight} ${weight < key[v] ? '<' : '≥'} key[${v}] = ${key[v] === Infinity ? '∞' : key[v]}${weight < key[v] ? ' → update.' : ' → no change.'}`,
      };

      if (weight < key[v]) {
        key[v] = weight;
        parent[v] = u;
        frontier.add(v);
      }
    }
  }

  yield {
    inMST: new Set(inMST),
    mstEdges: new Set(mstEdges),
    frontier: new Set(),
    examineEdge: null,
    current: null,
    examining: null,
    totalWeight,
    type: 'done',
    description: `MST complete. Edges: {${[...mstEdges].join(', ')}}. Total weight: ${totalWeight}.`,
  };
}

export function generatePrimSteps(input) {
  const steps = [];
  for (const step of primGenerator(input)) steps.push(step);
  return steps;
}

export { DEFAULT_WEIGHTED_GRAPH as DEFAULT_PRIM_GRAPH };

export function randomizePrimGraph() {
  return randomizeWeightedGraph();
}