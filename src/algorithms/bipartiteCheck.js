export const BIPARTITE_LEGEND = [
  { color: '#9ca3af', label: 'Uncolored' },
  { color: '#22c55e', label: 'Partition A (green)' },
  { color: '#fbbf24', label: 'Partition B / examining' },
  { color: '#3b82f6', label: 'Currently processing' },
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

// GraphVisualizer colors: visited=green, queue(array members)=yellow, current=blue, examining=yellow
// We repurpose the step state fields:
//   visited = set A  (shown green)
//   queue   = set B members  (shown yellow, since they're in the queue array)
//   current = node being processed (blue)
//   examining = neighbor being checked (yellow)
// For conflict: set examining to the conflicting node (shown yellow/orange in legend)
// We pass a `conflict` boolean so the description can say "not bipartite"

function* bipartiteGenerator({ nodes, edges }) {
  const adj = buildAdj(nodes, edges);
  const color = {};  // 0 = A (visited/green), 1 = B (queue/yellow)
  const setA = new Set();
  const setB = new Set();
  let isBipartite = true;

  yield {
    visited: new Set(setA),
    queue: [...setB],
    current: null,
    examining: null,
    description: 'Start: assign no colors yet.',
  };

  for (const startNode of nodes) {
    if (color[startNode.id] !== undefined) continue;

    color[startNode.id] = 0;
    setA.add(startNode.id);
    const queue = [startNode.id];

    yield {
      visited: new Set(setA),
      queue: [...setB],
      current: null,
      examining: startNode.id,
      description: `Node ${startNode.id} uncolored → assign to partition A, start BFS.`,
    };

    while (queue.length > 0) {
      const u = queue.shift();

      yield {
        visited: new Set(setA),
        queue: [...setB],
        current: u,
        examining: null,
        description: `Process ${u} (partition ${color[u] === 0 ? 'A' : 'B'}).`,
      };

      for (const v of adj[u]) {
        yield {
          visited: new Set(setA),
          queue: [...setB],
          current: u,
          examining: v,
          description: `Check neighbor ${v} of ${u}.`,
        };

        if (color[v] === undefined) {
          color[v] = 1 - color[u];
          if (color[v] === 0) setA.add(v); else setB.add(v);
          queue.push(v);

          yield {
            visited: new Set(setA),
            queue: [...setB],
            current: u,
            examining: v,
            description: `${v} uncolored → assign to partition ${color[v] === 0 ? 'A' : 'B'}.`,
          };
        } else if (color[v] === color[u]) {
          isBipartite = false;
          yield {
            visited: new Set(setA),
            queue: [...setB],
            current: u,
            examining: v,
            description: `Conflict: ${u} and ${v} are in the same partition — graph is NOT bipartite (odd cycle).`,
          };
        }
      }
    }
  }

  yield {
    visited: new Set(setA),
    queue: [...setB],
    current: null,
    examining: null,
    description: isBipartite
      ? `Done. Graph IS bipartite. Partition A: {${[...setA].join(',')}}. Partition B: {${[...setB].join(',')}}.`
      : 'Done. Graph is NOT bipartite (contains an odd cycle).',
  };
}

export function generateBipartiteSteps(input) {
  const steps = [];
  for (const step of bipartiteGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_BIPARTITE_GRAPH = {
  nodes: [0, 1, 2, 3, 4, 5].map((id) => ({ id, label: String(id) })),
  // Bipartite: L={0,1,2}, R={3,4,5}, edges only cross
  edges: [
    { from: 0, to: 3 },
    { from: 0, to: 4 },
    { from: 1, to: 3 },
    { from: 1, to: 5 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
  ],
  positions: {
    0: { x: 120, y: 80  },
    1: { x: 120, y: 170 },
    2: { x: 120, y: 260 },
    3: { x: 440, y: 80  },
    4: { x: 440, y: 170 },
    5: { x: 440, y: 260 },
  },
};

export function randomizeBipartiteGraph() {
  // 50% chance: proper bipartite; 50% chance: add one odd cycle
  const lSize = 3;
  const rSize = 3;
  const n = lSize + rSize;
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i, label: String(i) }));
  const edgeSet = new Set();
  const edges = [];

  // Add random cross edges L → R
  for (let l = 0; l < lSize; l++) {
    for (let r = lSize; r < n; r++) {
      if (Math.random() < 0.5) {
        const key = `${l}-${r}`;
        if (!edgeSet.has(key)) { edgeSet.add(key); edges.push({ from: l, to: r }); }
      }
    }
  }
  // Ensure at least 2 edges
  if (edges.length < 2) {
    edges.push({ from: 0, to: lSize }, { from: 1, to: lSize + 1 });
  }

  // Randomly add one odd edge (within same side) to make it non-bipartite
  if (Math.random() < 0.4) {
    edges.push({ from: 0, to: 1 });
  }

  const cx = 280, cy = 170, r = 130;
  const positions = {};
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions[i] = { x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) };
  }

  return { nodes, edges, positions };
}