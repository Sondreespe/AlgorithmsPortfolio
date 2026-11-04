import { DEFAULT_WEIGHTED_GRAPH, edgeKey, randomizeWeightedGraph } from './defaultWeightedGraph.js';

export const BELLMAN_FORD_LEGEND = [
  { color: '#9ca3af', label: 'Unreached' },
  { color: '#fbbf24', label: 'Being relaxed' },
  { color: '#3b82f6', label: 'Source of relaxation' },
  { color: '#22c55e', label: 'Distance finalized' },
  { color: '#f97316', label: 'Edge being examined' },
  { color: '#22c55e', label: 'Shortest-path tree edge' },
];

function* bellmanFordGenerator({ nodes, edges, startNode }) {
  const n = nodes.length;
  const dist = {};
  const prev = {};
  for (const node of nodes) dist[node.id] = Infinity;
  dist[startNode] = 0;
  const treeEdges = new Set();

  const fmtDist = (v) => (dist[v] === Infinity ? '∞' : dist[v]);
  const reached = () => new Set(nodes.filter((nd) => dist[nd.id] < Infinity).map((nd) => nd.id));

  yield {
    dist: { ...dist },
    visited: new Set([startNode]),
    frontier: new Set(),
    current: startNode,
    examining: null,
    examineEdge: null,
    treeEdges: new Set(),
    description: `Initialize: dist[${startNode}] = 0, all others = ∞.`,
  };

  for (let round = 1; round <= n - 1; round++) {
    let anyRelaxed = false;

    yield {
      dist: { ...dist },
      visited: reached(),
      frontier: new Set(),
      current: null,
      examining: null,
      examineEdge: null,
      treeEdges: new Set(treeEdges),
      description: `Round ${round} / ${n - 1}: scan all ${edges.length} edges.`,
    };

    for (const edge of edges) {
      for (const [u, v] of [[edge.from, edge.to], [edge.to, edge.from]]) {
        if (dist[u] === Infinity) continue;
        const candidate = dist[u] + edge.weight;

        yield {
          dist: { ...dist },
          visited: reached(),
          frontier: new Set(),
          current: u,
          examining: v,
          examineEdge: edgeKey(u, v),
          treeEdges: new Set(treeEdges),
          description: `Edge ${u}→${v} (w=${edge.weight}): ${fmtDist(u)} + ${edge.weight} = ${candidate} ${candidate < dist[v] ? '<' : '≥'} dist[${v}] = ${fmtDist(v)}.`,
        };

        if (candidate < dist[v]) {
          const old = fmtDist(v);
          dist[v] = candidate;
          prev[v] = u;
          anyRelaxed = true;
          treeEdges.clear();
          for (const [nd, p] of Object.entries(prev)) treeEdges.add(edgeKey(Number(nd), p));

          yield {
            dist: { ...dist },
            visited: reached(),
            frontier: new Set(),
            current: u,
            examining: v,
            examineEdge: edgeKey(u, v),
            treeEdges: new Set(treeEdges),
            description: `Relax! dist[${v}]: ${old} → ${candidate}.`,
          };
        }
      }
    }

    if (!anyRelaxed) {
      yield {
        dist: { ...dist },
        visited: reached(),
        frontier: new Set(),
        current: null,
        examining: null,
        examineEdge: null,
        treeEdges: new Set(treeEdges),
        description: `Round ${round}: no relaxations — converged early after ${round} round${round > 1 ? 's' : ''}.`,
      };
      return;
    }
  }

  yield {
    dist: { ...dist },
    visited: new Set(nodes.map((nd) => nd.id)),
    frontier: new Set(),
    current: null,
    examining: null,
    examineEdge: null,
    treeEdges: new Set(treeEdges),
    description: `Done (${n - 1} rounds). Distances from ${startNode}: ${nodes.map((nd) => `d[${nd.id}]=${fmtDist(nd.id)}`).join(', ')}.`,
  };
}

export function generateBellmanFordSteps(input) {
  const steps = [];
  for (const step of bellmanFordGenerator(input)) steps.push(step);
  return steps;
}

export { DEFAULT_WEIGHTED_GRAPH as DEFAULT_BELLMAN_FORD_GRAPH };
export { randomizeWeightedGraph as randomizeBellmanFordGraph };