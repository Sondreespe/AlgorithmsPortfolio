function buildAdjacency(nodes, edges) {
  const adj = {};
  for (const node of nodes) adj[node.id] = [];
  for (const edge of edges) {
    adj[edge.from].push(edge.to);
    adj[edge.to].push(edge.from);
  }
  return adj;
}

function* bfsGenerator({ nodes, edges, startNode }) {
  const adj = buildAdjacency(nodes, edges);
  const visited = new Set([startNode]);
  const queue = [startNode];

  yield {
    visited: new Set(visited),
    queue: [...queue],
    current: null,
    examining: null,
    description: `Initialize: enqueue start node ${startNode}. Queue: [${queue}].`,
  };

  while (queue.length > 0) {
    const current = queue.shift();

    yield {
      visited: new Set(visited),
      queue: [...queue],
      current,
      examining: null,
      description: `Dequeue ${current}. Queue: [${queue.join(', ') || '—'}].`,
    };

    for (const neighbor of adj[current]) {
      if (!visited.has(neighbor)) {
        yield {
          visited: new Set(visited),
          queue: [...queue],
          current,
          examining: neighbor,
          description: `Neighbor ${neighbor} of ${current} is unvisited — enqueue it.`,
        };

        visited.add(neighbor);
        queue.push(neighbor);

        yield {
          visited: new Set(visited),
          queue: [...queue],
          current,
          examining: neighbor,
          description: `${neighbor} marked visited and added to queue. Queue: [${queue.join(', ')}].`,
        };
      } else {
        yield {
          visited: new Set(visited),
          queue: [...queue],
          current,
          examining: neighbor,
          description: `Neighbor ${neighbor} of ${current} already visited — skip.`,
        };
      }
    }
  }

  yield {
    visited: new Set(visited),
    queue: [],
    current: null,
    examining: null,
    description: `BFS complete. Visited all ${visited.size} reachable nodes.`,
  };
}

export function generateBFSSteps(input) {
  const steps = [];
  for (const step of bfsGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_BFS_GRAPH = {
  startNode: 0,
  nodes: [0, 1, 2, 3, 4, 5, 6].map((id) => ({ id, label: String(id) })),
  edges: [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 },
  ],
  positions: {
    0: { x: 280, y: 50 },
    1: { x: 140, y: 150 },
    2: { x: 420, y: 150 },
    3: { x: 70,  y: 270 },
    4: { x: 210, y: 270 },
    5: { x: 350, y: 270 },
    6: { x: 490, y: 270 },
  },
};

export function randomizeBFSGraph() {
  const n = 7;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }));
  const edgeSet = new Set();
  const edges = [];

  // Guarantee connectivity via a random spanning tree
  const order = [...Array(n).keys()].sort(() => Math.random() - 0.5);
  for (let i = 1; i < order.length; i++) {
    const a = Math.min(order[i - 1], order[i]);
    const b = Math.max(order[i - 1], order[i]);
    const key = `${a}-${b}`;
    if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ from: a, to: b }); }
  }

  // A few extra random edges
  for (let attempts = 0; attempts < 30 && edges.length < n + 2; attempts++) {
    const a = Math.floor(Math.random() * n);
    const b = Math.floor(Math.random() * n);
    if (a !== b) {
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ from: a, to: b }); }
    }
  }

  // Circular layout
  const cx = 280, cy = 175, r = 130;
  const positions = {};
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[i] = { x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) };
  }

  return { startNode: 0, nodes, edges, positions };
}
