export const KAHN_LEGEND = [
  { color: '#9ca3af', label: 'Unprocessed' },
  { color: '#fbbf24', label: 'In queue (indegree 0)' },
  { color: '#3b82f6', label: 'Processing' },
  { color: '#22c55e', label: 'Placed in order' },
];

function buildDirectedAdjacency(nodes, edges) {
  const adj = {};
  const indegree = {};
  for (const node of nodes) {
    adj[node.id] = [];
    indegree[node.id] = 0;
  }
  for (const edge of edges) {
    adj[edge.from].push(edge.to);
    indegree[edge.to]++;
  }
  return { adj, indegree };
}

function* kahnGenerator({ nodes, edges }) {
  const { adj, indegree } = buildDirectedAdjacency(nodes, edges);
  const indeg = { ...indegree };

  const queue = nodes.filter((n) => indeg[n.id] === 0).map((n) => n.id);
  const order = [];
  const done = new Set();

  yield {
    visited: new Set(),
    queue: [...queue],
    current: null,
    examining: null,
    description: `Compute in-degrees. Zero-indegree nodes → queue: [${queue.join(', ')}].`,
  };

  while (queue.length > 0) {
    const current = queue.shift();
    done.add(current);
    order.push(current);

    yield {
      visited: new Set(done),
      queue: [...queue],
      current,
      examining: null,
      description: `Dequeue ${current} → position ${order.length}: order so far [${order.join(' → ')}].`,
    };

    for (const neighbor of adj[current]) {
      indeg[neighbor]--;
      const willEnqueue = indeg[neighbor] === 0;

      yield {
        visited: new Set(done),
        queue: [...queue],
        current,
        examining: neighbor,
        description: `Edge ${current}→${neighbor}: in-degree of ${neighbor} = ${indeg[neighbor]}.${willEnqueue ? ' Enqueued.' : ''}`,
      };

      if (willEnqueue) {
        queue.push(neighbor);
      }
    }
  }

  yield {
    visited: new Set(done),
    queue: [],
    current: null,
    examining: null,
    description:
      done.size < nodes.length
        ? `Cycle detected — only ${done.size}/${nodes.length} nodes processed.`
        : `Done. Topological order: [${order.join(' → ')}].`,
  };
}

export function generateKahnSteps(input) {
  const steps = [];
  for (const step of kahnGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_KAHN_GRAPH = {
  nodes: [0, 1, 2, 3, 4, 5].map((id) => ({ id, label: String(id) })),
  edges: [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 5 },
    { from: 4, to: 5 },
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

export function randomizeKahnGraph() {
  const n = 6;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }));
  const edgeSet = new Set();
  const edges = [];

  // Random permutation defines the topological order → only add edges forward in it
  const perm = [...Array(n).keys()].sort(() => Math.random() - 0.5);

  // Guarantee a connected chain along the perm order
  for (let i = 0; i < n - 1; i++) {
    const from = perm[i];
    const to = perm[i + 1];
    const key = `${from}-${to}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from, to });
    }
  }

  // Add a few extra forward edges
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (Math.random() < 0.3) {
        const from = perm[i];
        const to = perm[j];
        const key = `${from}-${to}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ from, to });
        }
      }
    }
  }

  // Circular layout
  const cx = 280, cy = 170, r = 130;
  const positions = {};
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[i] = {
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
    };
  }

  return { nodes, edges, positions };
}