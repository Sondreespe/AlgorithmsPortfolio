export const CC_LEGEND = [
  { color: '#9ca3af', label: 'Unvisited' },
  { color: '#fbbf24', label: 'In BFS queue' },
  { color: '#3b82f6', label: 'Processing' },
  { color: '#22c55e', label: 'Component found' },
];

function buildAdj(nodes, edges) {
  const adj = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  }
  return adj;
}

function* ccGenerator({ nodes, edges }) {
  const adj = buildAdj(nodes, edges);
  const visited = new Set();
  let compCount = 0;

  yield {
    visited: new Set(),
    queue: [],
    current: null,
    examining: null,
    description: 'Start: no nodes visited yet.',
  };

  for (const node of nodes) {
    if (visited.has(node.id)) continue;

    compCount++;
    const queue = [node.id];
    visited.add(node.id);

    yield {
      visited: new Set(visited),
      queue: [...queue],
      current: null,
      examining: null,
      description: `Node ${node.id} unvisited → start BFS for component ${compCount}.`,
    };

    while (queue.length > 0) {
      const current = queue.shift();

      yield {
        visited: new Set(visited),
        queue: [...queue],
        current,
        examining: null,
        description: `Dequeue ${current} (component ${compCount}).`,
      };

      for (const neighbor of adj[current]) {
        if (!visited.has(neighbor)) {
          yield {
            visited: new Set(visited),
            queue: [...queue],
            current,
            examining: neighbor,
            description: `Neighbor ${neighbor} of ${current} is unvisited — enqueue.`,
          };
          visited.add(neighbor);
          queue.push(neighbor);
        } else {
          yield {
            visited: new Set(visited),
            queue: [...queue],
            current,
            examining: neighbor,
            description: `Neighbor ${neighbor} already visited — skip.`,
          };
        }
      }
    }

    yield {
      visited: new Set(visited),
      queue: [],
      current: null,
      examining: null,
      description: `Component ${compCount} complete.`,
    };
  }

  yield {
    visited: new Set(visited),
    queue: [],
    current: null,
    examining: null,
    description: `Done. Found ${compCount} connected component${compCount !== 1 ? 's' : ''}.`,
  };
}

export function generateCCSteps(input) {
  const steps = [];
  for (const step of ccGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_CC_GRAPH = {
  nodes: [0, 1, 2, 3, 4, 5, 6].map((id) => ({ id, label: String(id) })),
  edges: [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
    { from: 5, to: 6 },
  ],
  positions: {
    0: { x: 80,  y: 120 },
    1: { x: 200, y: 80  },
    2: { x: 200, y: 200 },
    3: { x: 350, y: 80  },
    4: { x: 350, y: 220 },
    5: { x: 490, y: 100 },
    6: { x: 490, y: 240 },
  },
};

export function randomizeCCGraph() {
  const n = 7;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }));
  const edgeSet = new Set();
  const edges = [];

  // Split into 2–3 components randomly
  const numComps = 2 + Math.floor(Math.random() * 2);
  const compBoundaries = [0];
  for (let c = 1; c < numComps; c++) {
    compBoundaries.push(1 + Math.floor((n - numComps) * c / numComps) + c - 1);
  }
  compBoundaries.push(n);

  for (let c = 0; c < numComps; c++) {
    const start = compBoundaries[c];
    const end = compBoundaries[c + 1];
    const perm = Array.from({ length: end - start }, (_, i) => start + i).sort(() => Math.random() - 0.5);
    for (let i = 1; i < perm.length; i++) {
      const a = Math.min(perm[i - 1], perm[i]);
      const b = Math.max(perm[i - 1], perm[i]);
      const key = `${a}-${b}`;
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ from: a, to: b }); }
    }
  }

  const cx = 280, cy = 170, r = 130;
  const positions = {};
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[i] = { x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) };
  }

  return { nodes, edges, positions };
}