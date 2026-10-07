function tracePath(parent, x) {
  const path = [x];
  while (parent[path[path.length - 1]] !== path[path.length - 1]) {
    path.push(parent[path[path.length - 1]]);
  }
  return path;
}

function compressPath(parent, path) {
  const root = path[path.length - 1];
  for (const node of path.slice(0, -1)) parent[node] = root;
}

function* unionFindGenerator({ nodes, operations }) {
  const parent = Object.fromEntries(nodes.map((id) => [id, id]));
  const rank   = Object.fromEntries(nodes.map((id) => [id, 0]));

  yield {
    parent: { ...parent },
    rank:   { ...rank },
    highlighting: [],
    type: 'init',
    description: `Initialize: ${nodes.length} nodes, each its own root. parent[i] = i, rank[i] = 0.`,
  };

  for (const op of operations) {
    if (op.type === 'union') {
      const { a, b } = op;

      // --- find root of a ---
      const pathA = tracePath(parent, a);
      const ra = pathA[pathA.length - 1];

      yield {
        parent: { ...parent }, rank: { ...rank },
        highlighting: pathA,
        type: 'find',
        description: `union(${a}, ${b}): find(${a}) → path ${pathA.join(' → ')}, root = ${ra}.`,
      };

      if (pathA.length > 2) {
        compressPath(parent, pathA);
        yield {
          parent: { ...parent }, rank: { ...rank },
          highlighting: pathA.slice(0, -1),
          type: 'compress',
          description: `Path compression: ${pathA.slice(0, -1).join(', ')} now point directly to root ${ra}.`,
        };
      }

      // --- find root of b ---
      const pathB = tracePath(parent, b);
      const rb = pathB[pathB.length - 1];

      yield {
        parent: { ...parent }, rank: { ...rank },
        highlighting: pathB,
        type: 'find',
        description: `union(${a}, ${b}): find(${b}) → path ${pathB.join(' → ')}, root = ${rb}.`,
      };

      if (pathB.length > 2) {
        compressPath(parent, pathB);
        yield {
          parent: { ...parent }, rank: { ...rank },
          highlighting: pathB.slice(0, -1),
          type: 'compress',
          description: `Path compression: ${pathB.slice(0, -1).join(', ')} now point directly to root ${rb}.`,
        };
      }

      // --- merge or skip ---
      if (ra === rb) {
        yield {
          parent: { ...parent }, rank: { ...rank },
          highlighting: [a, b],
          type: 'same-component',
          description: `union(${a}, ${b}): both in same component (root ${ra}). No merge needed.`,
        };
      } else {
        let newRoot, other;
        if (rank[ra] < rank[rb])      { parent[ra] = rb; newRoot = rb; other = ra; }
        else if (rank[ra] > rank[rb]) { parent[rb] = ra; newRoot = ra; other = rb; }
        else                          { parent[rb] = ra; rank[ra]++; newRoot = ra; other = rb; }

        yield {
          parent: { ...parent }, rank: { ...rank },
          highlighting: [ra, rb],
          type: 'merged',
          description: `Union by rank: ${other} (rank ${rank[other]}) → ${newRoot} (rank ${rank[newRoot]}). Merged.`,
        };
      }

    } else {
      // stand-alone find
      const { a } = op;
      const path = tracePath(parent, a);
      const root = path[path.length - 1];

      yield {
        parent: { ...parent }, rank: { ...rank },
        highlighting: path,
        type: 'find',
        description: `find(${a}): path ${path.join(' → ')}, root = ${root}.`,
      };

      if (path.length > 2) {
        compressPath(parent, path);
        yield {
          parent: { ...parent }, rank: { ...rank },
          highlighting: path.slice(0, -1),
          type: 'compress',
          description: `Path compression: ${path.slice(0, -1).join(', ')} now point directly to root ${root}.`,
        };
      }
    }
  }

  const roots = nodes.filter((id) => parent[id] === id);
  yield {
    parent: { ...parent }, rank: { ...rank },
    highlighting: [],
    type: 'done',
    description: `Done. ${roots.length} component${roots.length !== 1 ? 's' : ''}, root${roots.length !== 1 ? 's' : ''}: {${roots.join(', ')}}.`,
  };
}

export function generateUFSteps(input) {
  const steps = [];
  for (const step of unionFindGenerator(input)) steps.push(step);
  return steps;
}

export const DEFAULT_UF_INPUT = {
  nodes: [0, 1, 2, 3, 4, 5, 6, 7],
  operations: [
    { type: 'union', a: 0, b: 1 },
    { type: 'union', a: 2, b: 3 },
    { type: 'union', a: 4, b: 5 },
    { type: 'union', a: 6, b: 7 },
    { type: 'union', a: 0, b: 2 },
    { type: 'union', a: 4, b: 6 },
    { type: 'find',  a: 3 },
    { type: 'union', a: 0, b: 4 },
  ],
};

export function randomizeUFInput() {
  const n = 8;
  const nodes = Array.from({ length: n }, (_, i) => i);
  const ops = [];

  // Generate random union operations and one find
  const pairs = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) pairs.push([i, j]);
  }
  pairs.sort(() => Math.random() - 0.5);

  const numOps = 6 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numOps && i < pairs.length; i++) {
    ops.push({ type: 'union', a: pairs[i][0], b: pairs[i][1] });
  }

  // Insert a find somewhere in the middle
  const findNode = Math.floor(Math.random() * n);
  const insertAt = Math.floor(ops.length / 2);
  ops.splice(insertAt, 0, { type: 'find', a: findNode });

  return { nodes, operations: ops };
}