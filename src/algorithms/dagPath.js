import { edgeKey } from './defaultWeightedGraph.js';

export const DAG_PATH_LEGEND = [
  { color: '#9ca3af', label: 'Not yet reached' },
  { color: '#fbbf24', label: 'In relaxation queue' },
  { color: '#3b82f6', label: 'Processing (topo order)' },
  { color: '#22c55e', label: 'Distance finalized' },
  { color: '#f97316', label: 'Edge being relaxed' },
  { color: '#22c55e', label: 'Shortest-path tree edge' },
];

function buildDirectedAdj(nodes, edges) {
  const adj = {};
  const indegree = {};
  for (const n of nodes) { adj[n.id] = []; indegree[n.id] = 0; }
  for (const e of edges) {
    adj[e.from].push({ to: e.to, weight: e.weight });
    indegree[e.to]++;
  }
  return { adj, indegree };
}

function topoSort(nodes, adj, indegree) {
  const indeg = { ...indegree };
  const queue = nodes.filter((n) => indeg[n.id] === 0).map((n) => n.id);
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const { to } of adj[u]) {
      indeg[to]--;
      if (indeg[to] === 0) queue.push(to);
    }
  }
  return order;
}

function* dagPathGenerator({ nodes, edges, startNode }) {
  const { adj, indegree } = buildDirectedAdj(nodes, edges);
  const order = topoSort(nodes, adj, indegree);
  const dist = {};
  const prev = {};
  for (const n of nodes) dist[n.id] = Infinity;
  dist[startNode] = 0;
  const treeEdges = new Set();
  const finalized = new Set();

  const fmtDist = (v) => (dist[v] === Infinity ? '∞' : dist[v]);

  yield {
    dist: { ...dist },
    visited: new Set([startNode]),
    frontier: new Set(),
    current: null,
    examining: null,
    examineEdge: null,
    treeEdges: new Set(),
    description: `Topological order: [${order.join(' → ')}]. dist[${startNode}] = 0, others = ∞.`,
  };

  for (const u of order) {
    finalized.add(u);

    yield {
      dist: { ...dist },
      visited: new Set(finalized),
      frontier: new Set(),
      current: u,
      examining: null,
      examineEdge: null,
      treeEdges: new Set(treeEdges),
      description: `Process ${u} (topo order). dist[${u}] = ${fmtDist(u)}.`,
    };

    if (dist[u] === Infinity) {
      yield {
        dist: { ...dist },
        visited: new Set(finalized),
        frontier: new Set(),
        current: u,
        examining: null,
        examineEdge: null,
        treeEdges: new Set(treeEdges),
        description: `dist[${u}] = ∞ — not reachable from ${startNode}. Skip outgoing edges.`,
      };
      continue;
    }

    for (const { to: v, weight: w } of adj[u]) {
      const candidate = dist[u] + w;
      yield {
        dist: { ...dist },
        visited: new Set(finalized),
        frontier: new Set(),
        current: u,
        examining: v,
        examineEdge: edgeKey(u, v),
        treeEdges: new Set(treeEdges),
        description: `Edge ${u}→${v} (w=${w}): ${fmtDist(u)} + ${w} = ${candidate} ${candidate < dist[v] ? '<' : '≥'} dist[${v}] = ${fmtDist(v)}.`,
      };

      if (candidate < dist[v]) {
        const old = fmtDist(v);
        dist[v] = candidate;
        prev[v] = u;
        treeEdges.clear();
        for (const [nd, p] of Object.entries(prev)) treeEdges.add(edgeKey(Number(nd), p));

        yield {
          dist: { ...dist },
          visited: new Set(finalized),
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

  yield {
    dist: { ...dist },
    visited: new Set(nodes.map((n) => n.id)),
    frontier: new Set(),
    current: null,
    examining: null,
    examineEdge: null,
    treeEdges: new Set(treeEdges),
    description: `Done. Shortest distances from ${startNode}: ${nodes.map((n) => `d[${n.id}]=${fmtDist(n.id)}`).join(', ')}.`,
  };
}

export function generateDAGPathSteps(input) {
  const steps = [];
  for (const step of dagPathGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_DAG_GRAPH = {
  startNode: 0,
  nodes: [0, 1, 2, 3, 4, 5].map((id) => ({ id, label: String(id) })),
  edges: [
    { from: 0, to: 1, weight: 3 },
    { from: 0, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 1, weight: 2 },
    { from: 2, to: 3, weight: 4 },
    { from: 2, to: 4, weight: 7 },
    { from: 3, to: 5, weight: 6 },
    { from: 4, to: 5, weight: 2 },
  ],
  positions: {
    0: { x: 60,  y: 170 },
    1: { x: 200, y: 80  },
    2: { x: 200, y: 260 },
    3: { x: 350, y: 80  },
    4: { x: 350, y: 260 },
    5: { x: 500, y: 170 },
  },
};

export function randomizeDAGGraph() {
  const n = 6;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }));
  const perm = [...Array(n).keys()].sort(() => Math.random() - 0.5);
  const edgeSet = new Set();
  const edges = [];

  for (let i = 0; i < n - 1; i++) {
    const from = perm[i];
    const to = perm[i + 1];
    const key = `${from}-${to}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from, to, weight: Math.floor(Math.random() * 8) + 1 });
    }
  }
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (Math.random() < 0.3) {
        const from = perm[i];
        const to = perm[j];
        const key = `${from}-${to}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ from, to, weight: Math.floor(Math.random() * 8) + 1 });
        }
      }
    }
  }

  const cx = 280, cy = 170, r = 130;
  const positions = {};
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[i] = { x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) };
  }
  return { startNode: perm[0], nodes, edges, positions };
}