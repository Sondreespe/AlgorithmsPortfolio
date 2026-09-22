import { DEFAULT_WEIGHTED_GRAPH, edgeKey, buildWeightedAdjacency, randomizeWeightedGraph } from './defaultWeightedGraph.js';

function* dijkstraGenerator({ nodes, edges, startNode }) {
  const adj = buildWeightedAdjacency(nodes, edges);
  const dist = {};
  const prev = {};
  const visited = new Set();
  const frontier = new Set();

  for (const node of nodes) dist[node.id] = Infinity;
  dist[startNode] = 0;
  frontier.add(startNode);

  const treeEdges = new Set();

  const fmtDist = (v) => (dist[v] === Infinity ? '∞' : dist[v]);

  yield {
    visited: new Set(visited),
    frontier: new Set(frontier),
    current: null,
    examining: null,
    examineEdge: null,
    treeEdges: new Set(treeEdges),
    dist: { ...dist },
    type: 'init',
    description: `Initialize: dist[${startNode}] = 0, all others = ∞. Add ${startNode} to frontier.`,
  };

  while (frontier.size > 0) {
    // Extract min-dist node from frontier
    let current = null;
    let minD = Infinity;
    for (const node of frontier) {
      if (dist[node] < minD) { minD = dist[node]; current = node; }
    }

    frontier.delete(current);
    visited.add(current);

    yield {
      visited: new Set(visited),
      frontier: new Set(frontier),
      current,
      examining: null,
      examineEdge: null,
      treeEdges: new Set(treeEdges),
      dist: { ...dist },
      type: 'extract',
      description: `Extract min: node ${current}  (dist = ${dist[current]}). Mark finalized.`,
    };

    for (const { to: neighbor, weight } of adj[current]) {
      if (visited.has(neighbor)) {
        yield {
          visited: new Set(visited),
          frontier: new Set(frontier),
          current,
          examining: neighbor,
          examineEdge: edgeKey(current, neighbor),
          treeEdges: new Set(treeEdges),
          dist: { ...dist },
          type: 'skip',
          description: `Edge ${current}→${neighbor} (w=${weight}): neighbor already finalized — skip.`,
        };
        continue;
      }

      const candidate = dist[current] + weight;

      yield {
        visited: new Set(visited),
        frontier: new Set(frontier),
        current,
        examining: neighbor,
        examineEdge: edgeKey(current, neighbor),
        treeEdges: new Set(treeEdges),
        dist: { ...dist },
        type: 'examine',
        description: `Examine ${current}→${neighbor} (w=${weight}): ${dist[current]} + ${weight} = ${candidate} ${candidate < dist[neighbor] ? '<' : '≥'} dist[${neighbor}] = ${fmtDist(neighbor)}.`,
      };

      if (candidate < dist[neighbor]) {
        const old = fmtDist(neighbor);
        const wasNew = !frontier.has(neighbor);
        dist[neighbor] = candidate;
        prev[neighbor] = current;
        frontier.add(neighbor);

        // Rebuild shortest-path tree from prev
        treeEdges.clear();
        for (const [node, p] of Object.entries(prev)) {
          treeEdges.add(edgeKey(Number(node), p));
        }

        yield {
          visited: new Set(visited),
          frontier: new Set(frontier),
          current,
          examining: neighbor,
          examineEdge: edgeKey(current, neighbor),
          treeEdges: new Set(treeEdges),
          dist: { ...dist },
          type: 'relax',
          description: `Relax! dist[${neighbor}]: ${old} → ${candidate}.${wasNew ? ` Add ${neighbor} to frontier.` : ''}`,
        };
      }
    }
  }

  yield {
    visited: new Set(visited),
    frontier: new Set(),
    current: null,
    examining: null,
    examineEdge: null,
    treeEdges: new Set(treeEdges),
    dist: { ...dist },
    type: 'done',
    description: `Done. Shortest distances from ${startNode}: ${nodes.map((n) => `d[${n.id}]=${fmtDist(n.id)}`).join(', ')}.`,
  };
}

export function generateDijkstraSteps(input) {
  const steps = [];
  for (const step of dijkstraGenerator(input)) steps.push(step);
  return steps;
}

export { DEFAULT_WEIGHTED_GRAPH as DEFAULT_DIJKSTRA_GRAPH };

export function randomizeDijkstraGraph() {
  return randomizeWeightedGraph();
}