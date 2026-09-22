export const DEFAULT_WEIGHTED_GRAPH = {
  startNode: 0,
  nodes: [0, 1, 2, 3, 4, 5].map((id) => ({ id, label: String(id) })),
  edges: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 1, to: 2, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 3, weight: 8 },
    { from: 2, to: 4, weight: 10 },
    { from: 3, to: 4, weight: 2 },
    { from: 3, to: 5, weight: 6 },
    { from: 4, to: 5, weight: 3 },
  ],
  positions: {
    0: { x: 80,  y: 170 },
    1: { x: 220, y: 60  },
    2: { x: 220, y: 280 },
    3: { x: 380, y: 60  },
    4: { x: 380, y: 280 },
    5: { x: 510, y: 170 },
  },
};

export function edgeKey(a, b) {
  return `${Math.min(a, b)}-${Math.max(a, b)}`;
}

export function buildWeightedAdjacency(nodes, edges) {
  const adj = {};
  for (const node of nodes) adj[node.id] = [];
  for (const edge of edges) {
    adj[edge.from].push({ to: edge.to, weight: edge.weight });
    adj[edge.to].push({ to: edge.from, weight: edge.weight });
  }
  return adj;
}

export function randomizeWeightedGraph() {
  const n = 6;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }));
  const edgeSet = new Set();
  const edges = [];

  // Spanning tree for connectivity
  const order = [...Array(n).keys()].sort(() => Math.random() - 0.5);
  for (let i = 1; i < order.length; i++) {
    const a = Math.min(order[i - 1], order[i]);
    const b = Math.max(order[i - 1], order[i]);
    const key = `${a}-${b}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from: a, to: b, weight: Math.floor(Math.random() * 9) + 1 });
    }
  }

  // A few extra edges
  for (let attempts = 0; attempts < 30 && edges.length < n + 3; attempts++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    if (a !== b) {
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ from: a, to: b, weight: Math.floor(Math.random() * 9) + 1 });
      }
    }
  }

  // Circular layout
  const cx = 295, cy = 170, r = 120;
  const positions = {};
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[i] = { x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) };
  }

  return { startNode: 0, nodes, edges, positions };
}