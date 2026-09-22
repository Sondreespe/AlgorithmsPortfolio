import { generateGSSteps, DEFAULT_GS_INPUT, randomizeGSInput } from './gsMatching.js';
import { generateCSSteps, DEFAULT_CS_INPUT, randomizeCSInput } from './coordinateSearch.js';
import { generateBFSSteps, DEFAULT_BFS_GRAPH, randomizeBFSGraph } from './bfs.js';
import { generateDFSSteps, DEFAULT_DFS_GRAPH, randomizeDFSGraph } from './dfs.js';
import { generateDijkstraSteps, DEFAULT_DIJKSTRA_GRAPH, randomizeDijkstraGraph } from './dijkstra.js';
import { generateKruskalSteps, DEFAULT_KRUSKAL_GRAPH, randomizeKruskalGraph } from './kruskal.js';
import { generatePrimSteps, DEFAULT_PRIM_GRAPH, randomizePrimGraph } from './prim.js';
import { generateGDSteps, DEFAULT_GD_INPUT, randomizeGDInput } from './gradientDescent.js';
import { generateNMSteps, DEFAULT_NM_INPUT, randomizeNMInput } from './newtonsMethod.js';
import { DFS_LEGEND } from '../visualizers/GraphVisualizer.jsx';
import { DIJKSTRA_LEGEND, KRUSKAL_LEGEND, PRIM_LEGEND } from '../visualizers/WeightedGraphVisualizer.jsx';

export const ALGORITHMS = [
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    course: 'INF234',
    category: 'Graph',
    description: 'Explores a graph level by level using a queue, visiting all neighbors before going deeper.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `BFS(graph, start):
  visited ← {start}
  queue  ← [start]

  while queue is not empty:
    u ← queue.dequeue()

    for each neighbor v of u:
      if v not in visited:
        visited.add(v)
        queue.enqueue(v)`,
    explanation: `BFS explores a graph layer by layer. It uses a FIFO queue: each dequeued node's unvisited neighbors are marked visited and enqueued. This guarantees that nodes are first reached via the shortest path (fewest edges). BFS is the basis for shortest-path algorithms and level-order traversals. Time complexity is O(V + E) since each vertex and edge is processed at most once.`,
    visualizerType: 'graph',
    defaultInput: DEFAULT_BFS_GRAPH,
    generateSteps: (input) => generateBFSSteps(input || DEFAULT_BFS_GRAPH),
    randomize: () => randomizeBFSGraph(),
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    course: 'INF234',
    category: 'Graph',
    description: 'Explores a graph by going as deep as possible along each branch before backtracking, using a stack.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `DFS(graph, start):
  visited ← {start}
  stack  ← [start]

  while stack is not empty:
    u ← stack.pop()

    for each neighbor v of u:
      if v not in visited:
        visited.add(v)
        stack.push(v)`,
    explanation: `DFS explores a graph by diving deep before backtracking. It uses a LIFO stack: each popped node's unvisited neighbors are marked visited and pushed. On a tree this gives pre-order traversal. Unlike BFS, DFS does not guarantee shortest paths, but uses O(V) space proportional to the depth of recursion rather than the width of the graph. Compare with BFS on the same tree: BFS visits level by level (0→1→2→3→4→5→6), while DFS dives into one branch first (0→2→6→5→1→4→3 for this layout, due to stack reversal). Both run in O(V + E).`,
    visualizerType: 'graph',
    legend: DFS_LEGEND,
    defaultInput: DEFAULT_DFS_GRAPH,
    generateSteps: (input) => generateDFSSteps(input || DEFAULT_DFS_GRAPH),
    randomize: () => randomizeDFSGraph(),
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    course: 'INF234',
    category: 'Graph',
    description: 'Finds shortest paths from a source node to all others in a weighted graph by greedily extracting the minimum-distance frontier node.',
    complexity: {
      time: { worst: 'O((V + E) log V)' },
      space: 'O(V)',
    },
    pseudocode: `Dijkstra(graph, start):
  dist[start] ← 0;  dist[v] ← ∞ for all v ≠ start
  frontier ← {start}

  while frontier not empty:
    u ← extract-min from frontier

    for each neighbor v of u  (edge weight w):
      if dist[u] + w < dist[v]:
        dist[v] ← dist[u] + w
        add v to frontier

  return dist`,
    explanation: `Dijkstra's algorithm finds single-source shortest paths in a graph with non-negative edge weights. It maintains a frontier (priority queue) of nodes with tentative distances. At each step it extracts the node with the smallest tentative distance, finalizes it, and relaxes its outgoing edges. "Relaxing" an edge u→v means checking if going through u gives a shorter path to v. Because weights are non-negative, once a node is extracted its distance is final. The distance labels shown below each node update as shorter paths are discovered. The green edges form the shortest-path tree.`,
    visualizerType: 'weighted-graph',
    legend: DIJKSTRA_LEGEND,
    defaultInput: DEFAULT_DIJKSTRA_GRAPH,
    generateSteps: (input) => generateDijkstraSteps(input || DEFAULT_DIJKSTRA_GRAPH),
    randomize: () => randomizeDijkstraGraph(),
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    course: 'INF234',
    category: 'Graph',
    description: 'Builds a minimum spanning tree by sorting all edges by weight and greedily adding the cheapest edge that does not create a cycle.',
    complexity: {
      time: { worst: 'O(E log E)' },
      space: 'O(V)',
    },
    pseudocode: `Kruskal(graph):
  sort edges by weight ascending
  uf ← UnionFind(all nodes)
  mst ← {}

  for each edge (u, v, w) in sorted order:
    if not uf.connected(u, v):
      mst.add(u, v)
      uf.union(u, v)
    // else: skip (would create cycle)

  return mst`,
    explanation: `Kruskal's algorithm finds the Minimum Spanning Tree (MST) — a spanning subgraph of minimum total edge weight. It sorts all edges by weight and processes them in order, using a Union-Find data structure to check whether adding an edge would create a cycle. If the two endpoints belong to different components, the edge is accepted and the components are merged; otherwise it is rejected. The algorithm terminates when exactly V−1 edges have been accepted. Time is dominated by sorting: O(E log E). The final MST has the same edges as Prim's MST on this graph.`,
    visualizerType: 'weighted-graph',
    legend: KRUSKAL_LEGEND,
    defaultInput: DEFAULT_KRUSKAL_GRAPH,
    generateSteps: (input) => generateKruskalSteps(input || DEFAULT_KRUSKAL_GRAPH),
    randomize: () => randomizeKruskalGraph(),
  },
  {
    id: 'prim',
    name: "Prim's MST",
    course: 'INF234',
    category: 'Graph',
    description: 'Grows a minimum spanning tree from a start node by always adding the cheapest edge crossing the cut between the MST and the rest of the graph.',
    complexity: {
      time: { worst: 'O((V + E) log V)' },
      space: 'O(V)',
    },
    pseudocode: `Prim(graph, start):
  inMST ← {start};  key[start] ← 0;  key[v] ← ∞ for all v ≠ start
  frontier ← neighbors of start

  while frontier not empty:
    u ← node in frontier with minimum key value
    add edge (parent[u], u) to MST

    for each neighbor v of u  (edge weight w):
      if v not in MST  and  w < key[v]:
        key[v] ← w;  parent[v] ← u

  return MST`,
    explanation: `Prim's algorithm grows a Minimum Spanning Tree one node at a time. It starts from an arbitrary node and maintains a "cut": the partition between nodes already in the MST and those not yet included. At each step it picks the cheapest edge crossing the cut (the minimum-key frontier node), adds it to the MST, and updates the keys of newly reachable neighbors. This is structurally identical to Dijkstra's algorithm but updates keys with raw edge weights rather than accumulated path lengths. On this graph, Prim's MST is the same as Kruskal's — both algorithms always find the unique minimum spanning tree.`,
    visualizerType: 'weighted-graph',
    legend: PRIM_LEGEND,
    defaultInput: DEFAULT_PRIM_GRAPH,
    generateSteps: (input) => generatePrimSteps(input || DEFAULT_PRIM_GRAPH),
    randomize: () => randomizePrimGraph(),
  },
  {
    id: 'gale-shapley',
    name: 'Gale-Shapley (Stable Matching)',
    course: 'INF234',
    category: 'Greedy',
    description: 'Finds a stable matching between two equal-sized groups using a propose-and-reject strategy.',
    complexity: {
      time: { worst: 'O(n²)' },
      space: 'O(n²)',
    },
    pseudocode: `GaleShapley(proposers, acceptors):
  free ← all proposers
  next ← {p: 0 for each proposer p}   // next proposal index

  while free is not empty:
    p ← first free proposer
    w ← proposerPrefs[p][next[p]]
    next[p]++

    if w is free:
      match(p, w)
      remove p from free

    else if w prefers p over current(w):
      free p's current partner
      match(p, w)
      remove p from free

    // else w rejects p, p stays free

  return matching`,
    explanation: `The Gale-Shapley algorithm solves the Stable Matching problem: given n proposers and n acceptors, each with a complete preference ranking, find a matching with no "blocking pair" — a pair (p, w) who both prefer each other over their assigned partners. GS always terminates in O(n²) proposals and always produces a stable matching that is optimal for the proposing side.`,
    visualizerType: 'bipartite',
    defaultInput: DEFAULT_GS_INPUT,
    generateSteps: (input) => generateGSSteps(input || DEFAULT_GS_INPUT),
    randomize: () => randomizeGSInput(4),
  },
  {
    id: 'gradient-descent',
    name: 'Gradient Descent',
    course: 'INF379',
    category: 'Optimization',
    description: 'Iteratively moves in the direction of steepest descent (−∇f) to minimize a differentiable function.',
    complexity: {
      time: { worst: 'O(iterations)' },
      space: 'O(iterations)',
    },
    pseudocode: `GradientDescent(f, ∇f, x₀, α):
  x ← x₀

  while |∇f(x)| ≥ ε:
    g ← ∇f(x)        // compute gradient
    x ← x − α · g    // step opposite to gradient

  return x`,
    explanation: `Gradient Descent minimizes a differentiable function f by repeatedly moving in the direction of steepest descent. The gradient ∇f points uphill, so we subtract it (scaled by learning rate α) at each step. On a strictly convex function like the elliptical bowl used here, GD converges to the global minimum. The learning rate controls the step size: too large causes oscillation or divergence, too small means slow convergence. On non-spherical problems (different curvature per axis), GD follows a characteristic zig-zag path.`,
    visualizerType: 'gradient-descent',
    defaultInput: DEFAULT_GD_INPUT,
    generateSteps: (input) => generateGDSteps(input || DEFAULT_GD_INPUT),
    randomize: () => randomizeGDInput(),
  },
  {
    id: 'newtons-method',
    name: "Newton's Method",
    course: 'INF379',
    category: 'Optimization',
    description: 'Uses second-order derivatives (Hessian) to compute exact curvature-scaled steps, converging in a single iteration on quadratic functions.',
    complexity: {
      time: { worst: 'O(d³ · iterations)' },
      space: 'O(d²)',
    },
    pseudocode: `Newton(f, ∇f, H, x₀):
  x ← x₀

  while |∇f(x)| ≥ ε:
    g ← ∇f(x)          // gradient
    H ← ∇²f(x)         // Hessian matrix
    d ← −H⁻¹ · g       // Newton direction
    x ← x + d          // full Newton step

  return x`,
    explanation: `Newton's Method for optimization extends gradient descent by incorporating second-order curvature information via the Hessian matrix H = ∇²f. Instead of stepping in the raw gradient direction, it computes d = −H⁻¹∇f — a direction that accounts for how quickly the gradient changes in each direction. On quadratic functions (like the elliptical bowl here), the Hessian is constant and Newton converges in exactly one step from any starting point. The orange dashed arrow shows what gradient descent (α = 0.1) would do: a short step that does not aim directly at the minimum. The teal arrow shows Newton's direction: it jumps straight to (2, 1). The cost is computing and inverting H at each iteration — O(d³) per step — which is expensive in high dimensions. In practice, quasi-Newton methods (e.g., BFGS) approximate H⁻¹ to reduce this cost.`,
    visualizerType: 'newtons-method',
    defaultInput: DEFAULT_NM_INPUT,
    generateSteps: (input) => generateNMSteps(input || DEFAULT_NM_INPUT),
    randomize: () => randomizeNMInput(),
  },
  {
    id: 'coordinate-search',
    name: 'Coordinate Search',
    course: 'INF379',
    category: 'Optimization',
    description: 'Minimizes a function by probing axis-aligned moves and halving the step size when no improvement is found.',
    complexity: {
      time: { worst: 'O(d · iterations)' },
      space: 'O(iterations)',
    },
    pseudocode: `CoordinateSearch(f, x₀, step):
  x ← x₀

  while step ≥ ε:
    best ← x
    bestVal ← f(x)

    for each axis direction d:
      candidate ← x + step · d
      if f(candidate) < bestVal:
        bestVal ← f(candidate)
        best ← candidate

    if best ≠ x:
      x ← best        // move to best neighbor
    else:
      step ← step / 2  // no improvement: reduce step

  return x`,
    explanation: `Coordinate Search (also called Pattern Search) minimizes a function by testing small moves along each coordinate axis. At each iteration it picks the best neighboring point; if no neighbor improves the objective it halves the step size. The algorithm converges when the step size falls below a threshold. It requires no gradient information, making it suitable for non-differentiable or black-box functions.`,
    visualizerType: 'contour',
    defaultInput: DEFAULT_CS_INPUT,
    generateSteps: (input) => generateCSSteps(input || DEFAULT_CS_INPUT),
    randomize: () => randomizeCSInput(),
  },
];
