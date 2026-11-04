import { generateGSSteps, DEFAULT_GS_INPUT, randomizeGSInput } from './gsMatching.js';
import { generateCSSteps, DEFAULT_CS_INPUT, randomizeCSInput } from './coordinateSearch.js';
import { generateBFSSteps, DEFAULT_BFS_GRAPH, randomizeBFSGraph } from './bfs.js';
import { generateDFSSteps, DEFAULT_DFS_GRAPH, randomizeDFSGraph } from './dfs.js';
import { generateDijkstraSteps, DEFAULT_DIJKSTRA_GRAPH, randomizeDijkstraGraph } from './dijkstra.js';
import { generateKruskalSteps, DEFAULT_KRUSKAL_GRAPH, randomizeKruskalGraph } from './kruskal.js';
import { generatePrimSteps, DEFAULT_PRIM_GRAPH, randomizePrimGraph } from './prim.js';
import { generateGDSteps, DEFAULT_GD_INPUT, randomizeGDInput } from './gradientDescent.js';
import { generateNMSteps, DEFAULT_NM_INPUT, randomizeNMInput } from './newtonsMethod.js';
import { generateUFSteps, DEFAULT_UF_INPUT, randomizeUFInput } from './unionFind.js';
import { generateCPSteps, DEFAULT_CP_INPUT, randomizeCPInput } from './closestPair.js';
import { DFS_LEGEND } from '../visualizers/GraphVisualizer.jsx';
import { DIJKSTRA_LEGEND, KRUSKAL_LEGEND, PRIM_LEGEND } from '../visualizers/WeightedGraphVisualizer.jsx';
import { generateKahnSteps, DEFAULT_KAHN_GRAPH, randomizeKahnGraph, KAHN_LEGEND } from './topologicalSort.js';

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
    id: 'union-find',
    name: 'Union-Find (Disjoint Sets)',
    course: 'INF234',
    category: 'Graph',
    description: 'A data structure that tracks disjoint sets with near-constant-time union and find operations, using union by rank and path compression.',
    complexity: {
      time: { worst: 'O(α(n)) per operation' },
      space: 'O(n)',
    },
    pseudocode: `find(x):                       union(a, b):
  if parent[x] ≠ x:              ra ← find(a)
    parent[x] ← find(parent[x]) rb ← find(b)
  return parent[x]               if ra = rb: return
  // path compression             if rank[ra] < rank[rb]:
                                     parent[ra] ← rb
                                   elif rank[ra] > rank[rb]:
                                     parent[rb] ← ra
                                   else:
                                     parent[rb] ← ra
                                     rank[ra]++
                                   // union by rank`,
    explanation: `Union-Find (Disjoint Set Union) maintains a partition of n elements into disjoint sets. Each set is represented as a tree with a root. \n\nfind(x) walks up the tree to the root, applying path compression: every node on the path is redirected to point directly at the root. This flattens the tree for future queries.\n\nunion(a, b) finds both roots, then merges the smaller-ranked tree under the larger-ranked one (union by rank). Equal ranks increment the new root's rank.\n\nTogether, path compression and union by rank give an amortized cost of O(α(n)) per operation, where α is the inverse Ackermann function — effectively constant for all practical n. This makes Union-Find the key component in Kruskal's MST algorithm.`,
    visualizerType: 'union-find',
    defaultInput: DEFAULT_UF_INPUT,
    generateSteps: (input) => generateUFSteps(input || DEFAULT_UF_INPUT),
    randomize: () => randomizeUFInput(),
  },
  {
    id: 'closest-pair',
    name: 'Closest Pair of Points',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Finds the two closest points in a set by recursively dividing the plane and checking a narrow strip around the divide line.',
    complexity: {
      time: { worst: 'O(n log² n)' },
      space: 'O(n)',
    },
    pseudocode: `ClosestPair(pts):
  sort pts by x
  return solve(pts)

solve(pts):
  if |pts| ≤ 3: return bruteForce(pts)

  mid ← |pts| / 2
  δ_L ← solve(pts[0..mid])
  δ_R ← solve(pts[mid+1..])
  δ ← min(δ_L, δ_R)

  strip ← {p ∈ pts : |p.x − pts[mid].x| < δ}
  sort strip by y

  for i in strip:
    for j in strip[i+1..] while |strip[j].y − strip[i].y| < δ:
      δ ← min(δ, dist(strip[i], strip[j]))

  return δ`,
    explanation: `Closest Pair of Points is a classic divide and conquer problem. The brute-force O(n²) check of all pairs is improved to O(n log n) by exploiting geometry.\n\nDivide: split the point set at the median x-coordinate into left and right halves.\n\nConquer: recursively find the closest pair in each half, giving δ = min(δ_left, δ_right).\n\nCombine: any pair crossing the divide line with distance < δ must lie in a strip of width 2δ around the divide line. After sorting strip points by y, each point needs to be compared with at most 7 others (a geometric argument shows no more than 8 points can fit in a δ × 2δ rectangle), giving O(n) combine time.\n\nTotal recurrence: T(n) = 2T(n/2) + O(n log n) → O(n log² n). With a presorted-by-y list, it can be reduced to O(n log n).`,
    visualizerType: 'closest-pair',
    defaultInput: DEFAULT_CP_INPUT,
    generateSteps: (input) => generateCPSteps(input || DEFAULT_CP_INPUT),
    randomize: () => randomizeCPInput(),
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

  // ── Topological Sort (Kahn's) ──────────────────────────────────────────────
  {
    id: 'topological-sort',
    name: "Topological Sort (Kahn's)",
    course: 'INF234',
    category: 'Graph',
    description: 'Orders nodes in a DAG so all edges point forward, using a queue of zero-indegree nodes.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `Kahn(graph):
  for each node v: indegree[v] ← in-degree of v
  queue ← {v : indegree[v] = 0}
  order ← []

  while queue not empty:
    u ← dequeue
    order.append(u)

    for each neighbor v of u:
      indegree[v] -= 1
      if indegree[v] = 0:
        queue.enqueue(v)

  if |order| < n: graph has a cycle
  return order`,
    explanation: `Kahn's algorithm finds a topological ordering of a DAG (Directed Acyclic Graph) — an arrangement of nodes where every directed edge goes from an earlier to a later node. It tracks the in-degree of each node: the number of unprocessed predecessors. Nodes with in-degree 0 have no prerequisites and are ready to output. When a node is dequeued it is added to the order and "removed" from the graph by decrementing the in-degree of each successor. Any successor whose in-degree drops to 0 joins the queue. If the output order contains fewer than n nodes, the graph has a cycle and no valid topological order exists.`,
    visualizerType: 'graph',
    directed: true,
    legend: KAHN_LEGEND,
    defaultInput: DEFAULT_KAHN_GRAPH,
    generateSteps: (input) => generateKahnSteps(input || DEFAULT_KAHN_GRAPH),
    randomize: () => randomizeKahnGraph(),
  },

  // ── Connected Components ───────────────────────────────────────────────────
  {
    id: 'connected-components',
    name: 'Connected Components',
    course: 'INF234',
    category: 'Graph',
    description: 'Finds all maximal connected subgraphs by running BFS/DFS from each unvisited node.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `ConnectedComponents(graph):
  visited ← {}
  comp    ← 0

  for each node v:
    if v not in visited:
      comp += 1
      BFS(v, visited, comp)
      // marks all nodes reachable from v
      // with component label comp

  return comp  // number of components`,
    explanation: `A connected component is a maximal set of nodes that are mutually reachable via undirected edges. The algorithm iterates over all nodes; whenever it finds an unvisited node it launches a BFS (or DFS) that labels all reachable nodes as part of the same component. Because each node and edge is processed at most once, the total time is O(V + E). The number of times the outer loop initiates a new search equals the number of components.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Bipartiteness Test ─────────────────────────────────────────────────────
  {
    id: 'bipartite-check',
    name: 'Bipartiteness Test (2-Coloring)',
    course: 'INF234',
    category: 'Graph',
    description: 'Tests whether a graph is bipartite by checking if it can be 2-colored with no monochromatic edge.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `IsBipartite(graph):
  color ← {v: none for each v}

  for each node s:
    if color[s] ≠ none: continue
    color[s] ← RED
    queue ← [s]

    while queue not empty:
      u ← dequeue
      for each neighbor v of u:
        if color[v] = none:
          color[v] ← opposite(color[u])
          enqueue v
        elif color[v] = color[u]:
          return false  // odd cycle found

  return true`,
    explanation: `A graph is bipartite if and only if it has no odd cycle. The 2-coloring algorithm runs BFS from each unvisited node: the source is colored RED, its neighbors BLUE, their neighbors RED, and so on. If we ever try to color a neighbor the same color as its parent we have found an odd cycle and the graph is not bipartite. All trees are bipartite. The key insight is that BFS alternates layers, and each edge must connect adjacent layers (opposite colors); a "back edge" within a layer signals an odd cycle.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Strong Connectivity ────────────────────────────────────────────────────
  {
    id: 'strong-connectivity',
    name: 'Strong Connectivity',
    course: 'INF234',
    category: 'Graph',
    description: 'Checks if every node in a directed graph is reachable from every other node.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `IsStronglyConnected(G, s):
  // BFS/DFS on G from s
  reachableG ← BFS(G, s)
  if reachableG ≠ V: return false

  // BFS/DFS on G_rev (all edges reversed) from s
  G_rev ← reverse all edges of G
  reachableRev ← BFS(G_rev, s)
  if reachableRev ≠ V: return false

  return true`,
    explanation: `A directed graph is strongly connected if there is a directed path between every ordered pair of nodes. The two-pass test exploits a key observation: node v can reach s in G if and only if s can reach v in the reverse graph G^rev. So BFS from s in G checks that s can reach everyone, and BFS from s in G^rev checks that everyone can reach s. Both passes run in O(V + E). Kosaraju's or Tarjan's algorithms find all strongly connected components in the same asymptotic time.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── DAG Shortest / Longest Path ───────────────────────────────────────────
  {
    id: 'dag-path',
    name: 'Shortest / Longest Path in a DAG',
    course: 'INF234',
    category: 'Graph',
    description: 'Finds shortest or longest weighted paths in a DAG using topological order and dynamic programming.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `// Shortest path from source s
ShortestDAG(G, s):
  order ← TopologicalSort(G)
  dist[s] ← 0;  dist[v] ← ∞ for v ≠ s

  for u in order:
    for each edge u→v with weight w:
      if dist[u] + w < dist[v]:
        dist[v] ← dist[u] + w

// Longest path from source s
LongestDAG(G, s):
  order ← TopologicalSort(G)
  dist[s] ← 0;  dist[v] ← −∞ for v ≠ s

  for u in order:
    for each edge u→v with weight w:
      if dist[u] + w > dist[v]:
        dist[v] ← dist[u] + w`,
    explanation: `Because a DAG has no cycles, its nodes can be processed in topological order and each node's distance finalized before any of its successors are reached. For shortest paths, initialize the source distance to 0 and all others to ∞, then relax each outgoing edge. The longest path uses the same structure with −∞ initialization and max-relaxation. This O(V + E) approach beats Dijkstra (O((V+E) log V)) and works with negative edge weights, which Dijkstra does not. The algorithm is essentially DP: OPT(v) = min/max over predecessors u of (OPT(u) + w(u,v)).`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Bellman–Ford ──────────────────────────────────────────────────────────
  {
    id: 'bellman-ford',
    name: 'Bellman–Ford',
    course: 'INF234',
    category: 'Graph',
    description: 'Single-source shortest paths with negative edge weights, using V−1 rounds of edge relaxation.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V)',
    },
    pseudocode: `BellmanFord(G, s):
  dist[s] ← 0;  dist[v] ← ∞ for v ≠ s

  for i ← 1 to n−1:
    for each edge (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] ← dist[u] + w

  // Negative cycle check (round n):
  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      report negative cycle

  return dist`,
    explanation: `Bellman–Ford computes single-source shortest paths in graphs that may have negative edge weights (but no negative cycles on paths from the source). The key invariant: after i rounds of relaxation, dist[v] is the shortest path using at most i edges. Since any simple path in an n-node graph has at most n−1 edges, n−1 rounds suffice. The optional n-th round detects negative cycles: if any distance can still be improved, a negative cycle is reachable. The O(VE) time is worse than Dijkstra's O((V+E) log V), but Dijkstra fails with negative weights.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Negative Cycle Detection ───────────────────────────────────────────────
  {
    id: 'negative-cycle',
    name: 'Negative Cycle Detection',
    course: 'INF234',
    category: 'Graph',
    description: 'Detects negative cycles anywhere in a weighted directed graph using Bellman–Ford with a virtual source.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V)',
    },
    pseudocode: `NegativeCycleDetection(G):
  Add virtual source s* with 0-weight
  edges to all other nodes

  dist[s*] ← 0;  dist[v] ← ∞ for v ≠ s*

  // Run n rounds (not n−1)
  for i ← 1 to n:
    for each edge (u, v, w):
      if dist[u] + w < dist[v]:
        dist[v] ← dist[u] + w

  for each edge (u, v, w):
    if dist[u] + w < dist[v]:
      return "negative cycle found"
  return "no negative cycle"`,
    explanation: `The standard Bellman–Ford detects negative cycles reachable from the source. To find any negative cycle in the graph, we add a virtual source s* with zero-weight edges to all nodes, ensuring every node is reachable from s*. Any negative cycle will then be detected in the extra n-th round: if any distance still improves after n−1 rounds, a negative cycle lies on a path to that node. This technique is used in currency arbitrage detection and for graphs where the starting node is not fixed.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Currency Arbitrage ────────────────────────────────────────────────────
  {
    id: 'currency-arbitrage',
    name: 'Currency Arbitrage',
    course: 'INF234',
    category: 'Graph',
    description: 'Finds profitable exchange cycles by reducing to negative cycle detection via logarithmic edge weights.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V)',
    },
    pseudocode: `CurrencyArbitrage(rates):
  // rates[i][j] = exchange rate i → j
  Build graph G:
    for each pair (i, j):
      add edge (i, j, weight = −ln(rates[i][j]))

  if G has a negative cycle:
    return "arbitrage opportunity exists"
  else:
    return "no arbitrage"

  // Profitable cycle: product of rates > 1
  //   ⟺  sum(ln(rate)) > 0
  //   ⟺  sum(−ln(rate)) < 0
  //   ⟺  negative cycle in G`,
    explanation: `A currency arbitrage opportunity exists when exchanging currencies in a cycle yields more than you started with — that is, when the product of exchange rates around a cycle exceeds 1. Taking logarithms turns products into sums: a profitable cycle has sum(ln(rate)) > 0, equivalently sum(−ln(rate)) < 0. By assigning edge weight −ln(rate_ij) to directed edge i→j, a profitable arbitrage cycle corresponds exactly to a negative cycle in the resulting graph. Bellman–Ford with a virtual source detects this in O(VE).`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Coin Change (Greedy) ──────────────────────────────────────────────────
  {
    id: 'coin-change-greedy',
    name: 'Coin Change (Greedy)',
    course: 'INF234',
    category: 'Greedy',
    description: 'Makes change using the fewest coins by always choosing the largest denomination that fits — optimal for standard coin systems, not all.',
    complexity: {
      time: { worst: 'O(n)' },
      space: 'O(1)',
    },
    pseudocode: `CoinChangeGreedy(coins, amount):
  sort coins descending
  count ← 0

  for each denomination c in coins:
    while amount ≥ c:
      amount -= c
      count  += 1

  if amount = 0: return count
  else: return "no solution"`,
    explanation: `The greedy coin-change strategy picks the largest denomination that fits, repeatedly, until the target is reached. This is optimal for canonical coin systems like US coins {25, 10, 5, 1}: a formal exchange argument shows any "better" solution can be transformed into the greedy one without increasing the count. However, the greedy approach fails for arbitrary coin systems. Classic counterexample: coins {4, 3, 1}, amount 6. Greedy picks 4+1+1 = 3 coins; optimal is 3+3 = 2 coins. For general coin systems, use dynamic programming.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Interval Scheduling ───────────────────────────────────────────────────
  {
    id: 'interval-scheduling',
    name: 'Interval Scheduling',
    course: 'INF234',
    category: 'Greedy',
    description: 'Selects the maximum number of non-overlapping jobs on a single machine by sorting on earliest finish time.',
    complexity: {
      time: { worst: 'O(n log n)' },
      space: 'O(1)',
    },
    pseudocode: `IntervalScheduling(jobs):
  sort jobs by finish time
  selected ← []
  lastEnd  ← −∞

  for each job j in sorted order:
    if j.start ≥ lastEnd:
      selected.add(j)
      lastEnd ← j.finish

  return selected`,
    explanation: `Interval Scheduling Maximization asks: given n jobs each with a start and finish time, select the maximum number of non-overlapping jobs. The greedy rule — always pick the compatible job that finishes earliest — is provably optimal via a "greedy stays ahead" argument: at every step, the greedy selection leaves at least as much remaining capacity as any other selection. After sorting by finish time (O(n log n)), the scan is O(n). Common wrong greedy rules: earliest start (a long early job blocks everything), shortest duration (misses the geometric structure), and fewest conflicts.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Interval Partitioning ─────────────────────────────────────────────────
  {
    id: 'interval-partitioning',
    name: 'Interval Partitioning',
    course: 'INF234',
    category: 'Greedy',
    description: 'Assigns all jobs to the minimum number of machines such that no two overlapping jobs share a machine.',
    complexity: {
      time: { worst: 'O(n log n)' },
      space: 'O(n)',
    },
    pseudocode: `IntervalPartitioning(jobs):
  sort jobs by start time
  pq ← priority queue keyed by finish time

  for each job j in sorted order:
    if pq not empty and
       pq.min_finish ≤ j.start:
      update that machine: finish ← j.finish
    else:
      pq.add(j.finish)   // open a new machine

  return pq.size   // = minimum machines needed`,
    explanation: `The minimum number of machines needed equals the maximum depth d — the maximum number of jobs simultaneously active at any point. The greedy algorithm achieves exactly d machines: process jobs by start time, and assign each to any free machine (earliest finish ≤ job start); if none is free, open a new machine. When a new machine is opened, all existing machines are occupied simultaneously with this job, so depth ≥ current machine count — which proves this machine is necessary. The priority queue makes this O(n log n).`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Minimize Max Lateness (EDF) ───────────────────────────────────────────
  {
    id: 'minimize-max-lateness',
    name: 'Minimize Max Lateness (EDF)',
    course: 'INF234',
    category: 'Greedy',
    description: 'Schedules jobs with deadlines on one machine to minimize maximum lateness by sorting on earliest deadline first.',
    complexity: {
      time: { worst: 'O(n log n)' },
      space: 'O(1)',
    },
    pseudocode: `MinimizeMaxLateness(jobs):
  sort jobs by deadline ascending   // EDF
  t ← 0  // current time

  for each job j in EDF order:
    j.start  ← t
    j.finish ← t + j.length
    t        ← j.finish
    j.lateness ← max(0, j.finish − j.deadline)

  return max lateness over all jobs`,
    explanation: `Given n jobs with processing times t_j and deadlines d_j on a single machine, the goal is to minimize maximum lateness L_max = max(finish_j − d_j). Earliest Deadline First (EDF) is optimal. The proof uses an inversion argument: any schedule that is not EDF has two adjacent jobs i, j where d_i > d_j but i is scheduled first. Swapping them cannot increase the maximum lateness of this pair — formally, the lateness of the new j is at most the original lateness of i — and does not affect other jobs. By repeatedly eliminating inversions, any schedule can be transformed into EDF without increasing L_max.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Binary Search ─────────────────────────────────────────────────────────
  {
    id: 'binary-search',
    name: 'Binary Search',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Locates a target in a sorted array by halving the search interval at each step.',
    complexity: {
      time: { best: 'O(1)', worst: 'O(log n)' },
      space: 'O(1)',
    },
    pseudocode: `BinarySearch(arr, target):
  lo ← 0;  hi ← n − 1

  while lo ≤ hi:
    mid ← (lo + hi) / 2

    if arr[mid] = target: return mid
    if arr[mid] < target: lo ← mid + 1
    else:                 hi ← mid − 1

  return "not found"`,
    explanation: `Binary search exploits the sorted order of an array to find a target in O(log n) time. At each step it checks the middle element: if it matches, we are done; if the target is larger, the left half is discarded; if smaller, the right half is discarded. Each comparison halves the remaining search space. The recurrence T(n) = T(n/2) + O(1) solves to O(log n) by the Master theorem. Binary search requires sorted input (or any structure with random access and a total order) and is the basis for lower/upper bound queries and binary search on the answer.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Merge Two Sorted Lists ────────────────────────────────────────────────
  {
    id: 'merge-sorted-lists',
    name: 'Merge Two Sorted Lists',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Combines two sorted sequences into one sorted sequence using two pointers in O(n) time.',
    complexity: {
      time: { worst: 'O(n)' },
      space: 'O(n)',
    },
    pseudocode: `Merge(A, B):
  result ← []
  i ← 0;  j ← 0

  while i < |A| and j < |B|:
    if A[i] ≤ B[j]:
      result.append(A[i]);  i++
    else:
      result.append(B[j]);  j++

  result += A[i..]   // append remainder
  result += B[j..]
  return result`,
    explanation: `Merging two sorted lists uses two pointers, one into each list. At each step the smaller front element is appended to the result and its pointer advances. When one list is exhausted the remaining elements of the other (all ≥ the last appended element) are copied directly. The total work is proportional to the combined length: O(n). This is the combine step of merge sort. The reason merge sort achieves O(n log n) is that at each of the O(log n) levels of the recursion tree, the total merge work across all subproblems at that level is exactly n.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Merge Sort ────────────────────────────────────────────────────────────
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Sorts an array by recursively splitting it in half and merging the sorted halves.',
    complexity: {
      time: { worst: 'O(n log n)' },
      space: 'O(n)',
    },
    pseudocode: `MergeSort(arr):
  if |arr| ≤ 1: return arr

  mid   ← |arr| / 2
  left  ← MergeSort(arr[0..mid])
  right ← MergeSort(arr[mid..])

  return Merge(left, right)`,
    explanation: `Merge sort is the canonical divide-and-conquer sorting algorithm. Divide: split the array at the midpoint. Conquer: recursively sort each half. Combine: merge the two sorted halves using the linear-time merge procedure. The recurrence T(n) = 2T(n/2) + Θ(n) solves to Θ(n log n) by the Master theorem (case a = b^d: 2 = 2^1, so the balanced case). The key intuition for the recursion-tree analysis: at each of the log n levels, the total merge work across all subproblems at that level is exactly n. Merge sort requires O(n) auxiliary space and is stable, but is not in-place.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Target Sum (Two Pointers) ─────────────────────────────────────────────
  {
    id: 'target-sum',
    name: 'Target Sum (Two Pointers)',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Finds a pair summing to a target in a sorted array using left and right pointers in O(n).',
    complexity: {
      time: { worst: 'O(n)' },
      space: 'O(1)',
    },
    pseudocode: `TargetSum(arr, T):
  // arr must be sorted
  i ← 0;  j ← n − 1

  while i < j:
    s ← arr[i] + arr[j]
    if s = T:  return (i, j)
    if s < T:  i++   // need larger sum
    else:       j--   // need smaller sum

  return "no pair found"`,
    explanation: `Two-pointer scan finds a pair summing to T in a sorted array in O(n) time. The pointers start at opposite ends. If the sum is too small, we advance the left pointer to get a larger value; if too large, we retreat the right pointer. This greedy choice is correct: at each step the skipped element cannot be part of any valid pair with the other pointer. The algorithm reduces 3-Sum from O(n³) to O(n²): sort once in O(n log n), then run Target Sum with T = −a[i] for each i.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── 3-Sum ─────────────────────────────────────────────────────────────────
  {
    id: 'three-sum',
    name: '3-Sum',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Finds three elements summing to zero by reducing to Target Sum via sorting.',
    complexity: {
      time: { worst: 'O(n²)' },
      space: 'O(1)',
    },
    pseudocode: `ThreeSum(arr):
  sort arr                      // O(n log n)

  for i ← 0 to n−3:
    j ← i+1;  k ← n−1
    while j < k:
      s ← arr[i] + arr[j] + arr[k]
      if s = 0: record (i,j,k); j++; k--
      if s < 0: j++
      else:      k--

  return all triples found`,
    explanation: `3-Sum asks whether any three elements of an array sum to zero. The brute-force O(n³) check of all triples is reduced to O(n²) by sorting and using the two-pointer technique. For each index i, the problem reduces to finding a pair among the remaining elements that sums to −a[i] — exactly Target Sum, solvable in O(n) with two pointers. The sort is a one-time O(n log n) cost. No sub-quadratic algorithm is known for the general case; the O(n²) bound is conjectured to be tight.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Master Theorem ────────────────────────────────────────────────────────
  {
    id: 'master-theorem',
    name: 'Master Theorem',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Solves divide-and-conquer recurrences T(n) = aT(n/b) + O(n^d) with three closed-form cases.',
    complexity: {
      time: { worst: 'See formula' },
      space: 'O(1)',
    },
    pseudocode: `T(n) = a·T(n/b) + O(n^d)
  a = number of subproblems
  b = shrink factor per level
  d = exponent of combine cost

  if a < b^d:  T(n) = O(n^d)          // combine dominates
  if a = b^d:  T(n) = O(n^d · log n)  // balanced
  if a > b^d:  T(n) = O(n^log_b(a))   // leaves dominate

Examples:
  Merge sort:    2T(n/2) + O(n)   → a=b^d → O(n log n)
  Binary search: T(n/2)  + O(1)   → a<b^d → O(log n)
  Karatsuba:     3T(n/2) + O(n)   → a>b^d → O(n^log₂3)`,
    explanation: `The Master theorem gives a closed-form solution for recurrences T(n) = aT(n/b) + O(n^d). The recursion tree has log_b(n) levels. Level k has a^k subproblems each of size n/b^k, contributing n^d · (a/b^d)^k work. The three cases compare the geometric ratio a/b^d: if < 1, the top level dominates (O(n^d)); if = 1, all levels are equal (O(n^d log n)); if > 1, the bottom leaves dominate (O(n^{log_b a})). The theorem does not cover all recurrences (e.g., T(n) = T(n/2) + O(n/log n)) but handles the most common algorithmic cases.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Karatsuba ─────────────────────────────────────────────────────────────
  {
    id: 'karatsuba',
    name: 'Karatsuba Multiplication',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Multiplies two n-digit numbers in O(n^1.585) using three recursive multiplications instead of four.',
    complexity: {
      time: { worst: 'O(n^log₂3) ≈ O(n^1.585)' },
      space: 'O(n)',
    },
    pseudocode: `Karatsuba(X, Y):
  if |X| = 1: return X * Y   // base case

  // Split: X = X₁·10^m + X₂
  //        Y = Y₁·10^m + Y₂
  X₁, X₂ ← high and low halves of X
  Y₁, Y₂ ← high and low halves of Y

  P₁ ← Karatsuba(X₁, Y₁)
  P₂ ← Karatsuba(X₂, Y₂)
  P₃ ← Karatsuba(X₁+X₂, Y₁+Y₂)

  middle ← P₃ − P₁ − P₂    // = X₁Y₂ + X₂Y₁

  return P₁·10^(2m) + middle·10^m + P₂`,
    explanation: `The schoolbook algorithm for multiplying two n-digit numbers makes four n/2-digit multiplications, giving T(n) = 4T(n/2) + O(n) → O(n²). Karatsuba reduces this to three using the identity X₁Y₂ + X₂Y₁ = (X₁+X₂)(Y₁+Y₂) − X₁Y₁ − X₂Y₂. Only P₁ = X₁Y₁, P₂ = X₂Y₂, and P₃ = (X₁+X₂)(Y₁+Y₂) need recursive calls; the cross-term is recovered algebraically. The recurrence T(n) = 3T(n/2) + O(n) gives T(n) = O(n^{log₂3}) ≈ O(n^1.585) by the Master theorem (a = 3 > b^d = 2).`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Strassen ──────────────────────────────────────────────────────────────
  {
    id: 'strassen',
    name: 'Strassen Matrix Multiplication',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Multiplies two n×n matrices in O(n^2.807) using seven recursive products instead of eight.',
    complexity: {
      time: { worst: 'O(n^log₂7) ≈ O(n^2.807)' },
      space: 'O(n²)',
    },
    pseudocode: `Strassen(A, B):
  // Split each matrix into four n/2×n/2 blocks
  // A = [[A₁₁, A₁₂], [A₂₁, A₂₂]]

  M₁ = (A₁₁+A₂₂)(B₁₁+B₂₂)
  M₂ = (A₂₁+A₂₂)B₁₁
  M₃ = A₁₁(B₁₂−B₂₂)
  M₄ = A₂₂(B₂₁−B₁₁)
  M₅ = (A₁₁+A₁₂)B₂₂
  M₆ = (A₂₁−A₁₁)(B₁₁+B₁₂)
  M₇ = (A₁₂−A₂₂)(B₂₁+B₂₂)

  C₁₁ = M₁+M₄−M₅+M₇
  C₁₂ = M₃+M₅
  C₂₁ = M₂+M₄
  C₂₂ = M₁−M₂+M₃+M₆
  return C`,
    explanation: `Naive matrix multiplication of two n×n matrices uses O(n³) arithmetic operations (eight n/2×n/2 recursive multiplications in the divide-and-conquer formulation). Strassen's key insight is that the four blocks of the product can be expressed using only seven recursive products at the cost of extra additions. The recurrence T(n) = 7T(n/2) + O(n²) solves to T(n) = O(n^{log₂7}) ≈ O(n^2.807). Additions are O(n²), dominated by n^{log₂7} ≈ n^2.807. While theoretically significant, Strassen has poor cache performance and is rarely faster in practice until n is in the thousands.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Count Inversions ──────────────────────────────────────────────────────
  {
    id: 'count-inversions',
    name: 'Count Inversions (Sort & Count)',
    course: 'INF234',
    category: 'Divide & Conquer',
    description: 'Counts inverted pairs (i < j but a[i] > a[j]) in O(n log n) by piggybacking on merge sort.',
    complexity: {
      time: { worst: 'O(n log n)' },
      space: 'O(n)',
    },
    pseudocode: `SortAndCount(arr):
  if |arr| ≤ 1: return (arr, 0)
  mid ← |arr| / 2
  (L, leftInv)  ← SortAndCount(arr[0..mid])
  (R, rightInv) ← SortAndCount(arr[mid..])
  (sorted, splitInv) ← MergeCount(L, R)
  return (sorted, leftInv + rightInv + splitInv)

MergeCount(L, R):
  i ← j ← inv ← 0;  result ← []
  while i < |L| and j < |R|:
    if L[i] ≤ R[j]:
      result.append(L[i]);  i++
    else:
      inv += |L| − i   // all remaining L > R[j]
      result.append(R[j]);  j++
  ... append remainders ...`,
    explanation: `An inversion is a pair (i, j) with i < j but a[i] > a[j] — it measures how "unsorted" an array is. The brute-force O(n²) count is reduced to O(n log n) by embedding a counter in merge sort. All inversions are either within the left half, within the right half, or "split" (one element from each half). Left and right inversions are counted recursively. Split inversions are counted during the merge: when an element from the right half is taken (smaller than the current left element), all remaining left elements form inversions with it, contributing |L| − i in one step. This adds O(n) work per level, giving O(n log n) total.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── DP Pattern (Fibonacci / Memoization) ──────────────────────────────────
  {
    id: 'dp-fibonacci',
    name: 'DP Pattern (Fibonacci / Memoization)',
    course: 'INF234',
    category: 'DP',
    description: 'Illustrates the DP recipe — subproblems, recurrence, base cases — using Fibonacci as the canonical example.',
    complexity: {
      time: { worst: 'O(n)' },
      space: 'O(n)',
    },
    pseudocode: `// Naive: exponential time
Fib(n):
  if n ≤ 1: return n
  return Fib(n−1) + Fib(n−2)   // 2^n calls

// Top-down with memoization: O(n)
memo ← {}
FibMemo(n):
  if n in memo: return memo[n]
  if n ≤ 1: return n
  memo[n] ← FibMemo(n−1) + FibMemo(n−2)
  return memo[n]

// Bottom-up DP: O(n) time, O(1) space
FibDP(n):
  if n ≤ 1: return n
  a, b ← 0, 1
  for i ← 2 to n: a, b ← b, a+b
  return b`,
    explanation: `Dynamic programming solves problems by breaking them into overlapping subproblems, solving each once, and storing the result. The DP recipe: (1) identify the subproblems; (2) write the recurrence; (3) specify base cases; (4) determine evaluation order. The naive recursive Fibonacci makes O(2^n) calls by recomputing the same values exponentially many times. Memoization stores each result, reducing to O(n) unique calls. Bottom-up fills a table in increasing order, eliminating recursion overhead. The same four-step recipe — subproblems, recurrence, base cases, order — applies to every DP problem.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Weighted Interval Scheduling ──────────────────────────────────────────
  {
    id: 'weighted-interval-scheduling',
    name: 'Weighted Interval Scheduling',
    course: 'INF234',
    category: 'DP',
    description: 'Selects non-overlapping jobs to maximize total weight using DP on jobs sorted by finish time.',
    complexity: {
      time: { worst: 'O(n log n)' },
      space: 'O(n)',
    },
    pseudocode: `WeightedIS(jobs):
  sort jobs by finish time
  // p[j] = latest job ending before job j starts
  p[j] ← BinarySearch for each j   // O(log n)

  OPT[0] ← 0
  for j ← 1 to n:
    OPT[j] ← max(OPT[j−1],
                  w[j] + OPT[p[j]])

  // Traceback:
  j ← n
  while j > 0:
    if w[j] + OPT[p[j]] ≥ OPT[j−1]:
      select j;  j ← p[j]
    else:
      j ← j − 1`,
    explanation: `Weighted Interval Scheduling generalizes Interval Scheduling by assigning a weight to each job; the goal is the maximum-weight compatible set. Greedy (earliest finish time) is no longer optimal when weights differ. The DP subproblem OPT(j) = maximum weight using only jobs 1..j (sorted by finish). The recurrence reflects a binary choice: include job j (w_j + OPT(p(j))) or skip it (OPT(j−1)), where p(j) is the latest job finishing before j starts. Computing p(j) uses binary search after sorting, giving O(log n) per job. Traceback runs the same logic in reverse to recover the selected jobs.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Segmented Least Squares ───────────────────────────────────────────────
  {
    id: 'segmented-least-squares',
    name: 'Segmented Least Squares',
    course: 'INF234',
    category: 'DP',
    description: 'Fits a sequence of points with a minimum-cost piecewise linear regression using DP.',
    complexity: {
      time: { worst: 'O(n³)' },
      space: 'O(n²)',
    },
    pseudocode: `SegmentedLS(points, c):
  // c = penalty per line segment
  sort points by x-coordinate
  for all 1 ≤ i ≤ j ≤ n:
    e[i][j] ← SSE of best line through pts i..j

  OPT[0] ← 0
  for j ← 1 to n:
    OPT[j] ← min over 1 ≤ i ≤ j of:
                e[i][j] + c + OPT[i−1]

  return OPT[n]`,
    explanation: `Segmented Least Squares fits n data points with a piecewise linear function that minimizes total squared error plus a penalty c per segment (regularizing the number of pieces). The DP subproblem OPT(j) = minimum cost to fit points 1..j. For each possible last segment [i..j], the cost is e(i,j) (sum of squared residuals for the best line through those points) + c + OPT(i−1). Precomputing all e(i,j) takes O(n²) using prefix sums for means and cross-products; the DP itself is O(n²) giving O(n²) total. Without prefix sums, the naive computation of e(i,j) makes the total O(n³).`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Knapsack 0/1 ──────────────────────────────────────────────────────────
  {
    id: 'knapsack',
    name: 'Knapsack 0/1',
    course: 'INF234',
    category: 'DP',
    description: 'Maximizes the value of items packed into a weight-limited knapsack, where each item is used at most once.',
    complexity: {
      time: { worst: 'O(nW)' },
      space: 'O(nW)',
    },
    pseudocode: `Knapsack(items, W):
  // items: (weight wⱼ, value vⱼ), capacity W
  OPT[0][0..W] ← 0

  for j ← 1 to n:
    for w ← 0 to W:
      OPT[j][w] ← OPT[j−1][w]   // skip item j
      if wⱼ ≤ w:
        OPT[j][w] ← max(OPT[j][w],
                         vⱼ + OPT[j−1][w−wⱼ])

  return OPT[n][W]`,
    explanation: `The 0/1 Knapsack problem: given n items each with weight w_j and value v_j, and capacity W, select items to maximize total value with no item used more than once. The DP subproblem OPT(j, w) = maximum value using items 1..j with capacity w. The recurrence: skip item j (OPT(j−1, w)) or take it if it fits (v_j + OPT(j−1, w − w_j)). The table has O(nW) entries, each O(1). The O(nW) complexity is pseudo-polynomial: the exponent depends on the magnitude of W, not its bit-length. The problem is NP-hard in general, so no polynomial algorithm is known. All greedy heuristics (by value, weight, or ratio) fail on some inputs.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Edit Distance ─────────────────────────────────────────────────────────
  {
    id: 'edit-distance',
    name: 'Edit Distance (Levenshtein)',
    course: 'INF234',
    category: 'DP',
    description: 'Computes the minimum number of insertions, deletions, and substitutions to transform one string into another.',
    complexity: {
      time: { worst: 'O(nm)' },
      space: 'O(nm)',
    },
    pseudocode: `EditDistance(S, T):
  // |S| = n, |T| = m
  OPT[i][0] ← i  // delete i chars
  OPT[0][j] ← j  // insert j chars

  for i ← 1 to n:
    for j ← 1 to m:
      if S[i] = T[j]:
        OPT[i][j] ← OPT[i−1][j−1]      // match
      else:
        OPT[i][j] ← 1 + min(
          OPT[i−1][j−1],  // substitute
          OPT[i−1][j],    // delete from S
          OPT[i][j−1]     // insert into S
        )

  return OPT[n][m]`,
    explanation: `Edit distance (Levenshtein distance) is the minimum number of single-character edits (insert, delete, substitute) to transform string S into string T. The DP subproblem OPT(i, j) = edit distance between S[1..i] and T[1..j]. If the last characters match, no edit is needed: OPT(i,j) = OPT(i−1,j−1). Otherwise, take the cheapest of three options: substitute (diagonal −1,−1), delete S[i] (from above −1,0), or insert T[j] (from left 0,−1). The table fills in O(nm) time. Space can be reduced to O(n+m) by keeping only two rows; Hirschberg's algorithm also recovers the alignment within that space bound.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Ford–Fulkerson ────────────────────────────────────────────────────────
  {
    id: 'ford-fulkerson',
    name: 'Ford–Fulkerson (Max Flow)',
    course: 'INF234',
    category: 'Flow',
    description: 'Finds maximum s-t flow by repeatedly augmenting along paths in the residual network.',
    complexity: {
      time: { worst: 'O(mF)' },
      space: 'O(V + E)',
    },
    pseudocode: `FordFulkerson(G, s, t):
  f ← 0 on all edges

  while ∃ augmenting path P in residual(G):
    // Forward edge u→v: residual cap = c−f
    // Backward edge v→u: residual cap = f
    b ← bottleneck(P)   // min residual cap on P

    for each edge (u,v) on P:
      if forward edge:  f(u,v) += b
      if backward edge: f(v,u) -= b

  return total flow  // = min-cut capacity`,
    explanation: `Ford–Fulkerson iteratively finds augmenting paths in the residual network — a graph with forward edges (remaining capacity c−f) and backward edges (capacity equal to current flow, allowing "undo"). The bottleneck of a path is the minimum residual capacity along it; sending that much flow saturates at least one edge. The algorithm terminates when no augmenting path exists; by the max-flow min-cut theorem, the final flow equals the minimum s-t cut capacity. With DFS path search the runtime is O(mF), not polynomial for large capacities. Using BFS (Edmonds–Karp) gives O(nm²).`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Finding a Min Cut ─────────────────────────────────────────────────────
  {
    id: 'min-cut',
    name: 'Finding a Minimum Cut',
    course: 'INF234',
    category: 'Flow',
    description: 'Extracts the minimum s-t cut from a max-flow solution using BFS on the final residual network.',
    complexity: {
      time: { worst: 'O(V + E)' },
      space: 'O(V)',
    },
    pseudocode: `MinCut(G, s, t, flow):
  Build residual network from flow f:
    forward edge (u,v) if c(u,v)−f(u,v) > 0
    backward edge (v,u) if f(u,v) > 0

  A ← nodes reachable from s in residual
  B ← V \\ A   // t ∈ B

  cut ← {(u,v) ∈ E : u ∈ A, v ∈ B}
  // c(A,B) = max flow value (by max-flow min-cut)
  return cut`,
    explanation: `After running Ford–Fulkerson, the minimum cut is read from the final residual network. BFS/DFS from s using only edges with positive residual capacity identifies the set A of reachable nodes; the set B = V \\ A contains t. Every original edge from A to B is saturated (flow = capacity, zero forward residual), confirming the cut capacity equals the max flow. Every original edge from B to A carries zero flow (otherwise its backward residual edge would have extended A). This O(V+E) extraction completes the proof of the max-flow min-cut theorem constructively.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Bipartite Matching via Flow ───────────────────────────────────────────
  {
    id: 'bipartite-matching-flow',
    name: 'Bipartite Matching via Flow',
    course: 'INF234',
    category: 'Flow',
    description: 'Finds a maximum matching in a bipartite graph by reducing to max-flow.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V + E)',
    },
    pseudocode: `BipartiteMatching(G = (L ∪ R, E)):
  Build flow network:
    s → each l ∈ L  with capacity 1
    each r ∈ R → t  with capacity 1
    each (l,r) ∈ E  directed l→r, capacity 1

  maxFlow ← FordFulkerson(network, s, t)
  matching ← {(l,r) : f(l→r) = 1}
  return matching   // |matching| = maxFlow`,
    explanation: `Maximum bipartite matching finds the largest set of edges with no shared endpoints in a bipartite graph G = (L ∪ R, E). The reduction to max-flow: super-source s to every left node (capacity 1), every right node to super-sink t (capacity 1), and all original edges L→R with capacity 1. An integer max-flow corresponds exactly to a matching; each unit of flow L→R is a matched edge. The max-flow equals the matching size. Ford–Fulkerson runs in O(mF) = O(mV) since F ≤ min(|L|, |R|). Augmenting paths in the network correspond to alternating paths in the bipartite graph.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Minimum Vertex Cover ──────────────────────────────────────────────────
  {
    id: 'vertex-cover',
    name: 'Minimum Vertex Cover (Bipartite)',
    course: 'INF234',
    category: 'Flow',
    description: "Finds the smallest set of nodes covering all edges in a bipartite graph using König's theorem.",
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V + E)',
    },
    pseudocode: `MinVertexCover(G = (L ∪ R, E)):
  Run BipartiteMatching → flow f, cuts (A, B)
  // A = nodes reachable from s in residual
  // B = V \\ A

  cover ← (L ∩ B) ∪ (R ∩ A)
  return cover

  // König–Egerváry theorem:
  // |max matching| = |min vertex cover|
  // (holds only for bipartite graphs)`,
    explanation: `A vertex cover is a set of nodes such that every edge has at least one endpoint in the set. König–Egerváry theorem: in bipartite graphs, the maximum matching size equals the minimum vertex cover size. The minimum cover is extracted from the minimum cut: after running max-flow, let A be nodes reachable from s in the residual network. The minimum cover is (L ∩ B) ∪ (R ∩ A). It covers all edges: a left node not in the cover (l ∈ L ∩ A) must have all neighbors in R ∩ A, otherwise an augmenting path would exist. König–Egerváry does not hold for general graphs; minimum vertex cover is NP-hard in general.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Flow Modeling Tricks ──────────────────────────────────────────────────
  {
    id: 'flow-modeling',
    name: 'Flow Modeling Tricks',
    course: 'INF234',
    category: 'Flow',
    description: 'Standard reductions for modeling problems as max-flow: undirected edges, node capacities, multiple sources/sinks.',
    complexity: {
      time: { worst: 'O(VE) after reduction' },
      space: 'O(V + E)',
    },
    pseudocode: `// Undirected edge (u, v, c):
Replace with two directed edges:
  u→v capacity c  AND  v→u capacity c

// Node capacity v with bound k:
  Split v → v_in and v_out
  Add edge (v_in → v_out, capacity k)
  Redirect: in-edges → v_in
             out-edges from v_out

// Multiple sources / sinks:
  Add super-source s*:
    s* → each sᵢ, capacity ∞
  Add super-sink t*:
    each tᵢ → t*, capacity ∞
  Run max-flow on modified graph.`,
    explanation: `Many combinatorial problems reduce to max-flow once the network is modeled correctly. Three common transformations: (1) Undirected edge: replace with two anti-parallel directed edges; in the residual, the backward edge of one direction "cancels" the forward edge of the other. (2) Node capacity: split each capacity-limited node v into v_in and v_out connected by a capacity-k edge. (3) Multiple sources and sinks: introduce a super-source/super-sink. The max-flow on the modified graph solves the original problem. Edge-disjoint paths, bipartite matching, and project selection all use these techniques.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Circulation with Demands ──────────────────────────────────────────────
  {
    id: 'circulation-demands',
    name: 'Circulation with Demands',
    course: 'INF234',
    category: 'Flow',
    description: 'Finds a feasible flow satisfying lower-bound demands on edges using a reduction to standard max-flow.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V + E)',
    },
    pseudocode: `Circulation(G with demands d(u,v)):
  Build G':
    for each edge (u,v) with demand d:
      capacity in G' ← c(u,v) − d
      excess[v] += d   // v gains d forced flow
      excess[u] -= d   // u loses d forced flow

  Add super-source s*, super-sink t*:
    for each v with excess[v] > 0:  s* → v, cap = excess[v]
    for each u with excess[u] < 0:  u → t*, cap = −excess[u]

  Run max-flow on G' from s* to t*
  Feasible iff all s*-edges are saturated`,
    explanation: `A circulation assigns flows to edges satisfying flow conservation at every node. With lower bounds (demands), each edge must carry at least d(u,v) units. The reduction: pre-assign d(u,v) on every edge, reduce capacities to c(u,v) − d(u,v), and balance forced flows via a super-source s* and super-sink t*. Each node that receives more forced flow than it sends gets an edge from s*; each node that sends more than it receives gets an edge to t*. A feasible circulation exists if and only if the max-flow from s* to t* saturates all edges out of s*. The final flow on edge (u,v) is d(u,v) plus the flow in the reduced graph.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Circulation with Lower Bounds ─────────────────────────────────────────
  {
    id: 'circulation-lower-bounds',
    name: 'Circulation with Lower Bounds',
    course: 'INF234',
    category: 'Flow',
    description: 'Extends circulation with demands to enforce minimum and maximum flow on individual edges.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V + E)',
    },
    pseudocode: `CirculationWithBounds(G, l, c):
  // l(u,v) ≤ f(u,v) ≤ c(u,v)
  for each edge (u,v) with lower bound ℓ:
    c'(u,v) ← c(u,v) − ℓ   // residual capacity
    excess[v] += ℓ
    excess[u] -= ℓ

  Solve as circulation with demands
  (using the s*/t* super-source/sink method)

  final flow on (u,v) = ℓ(u,v) + flow in G'`,
    explanation: `When every edge has both a lower bound l(u,v) and an upper bound c(u,v), the reduction first "pre-routes" l(u,v) units on every edge. This creates excess at the edge's head and deficit at its tail. The remaining problem is a standard circulation with demands: adjust capacities to c(u,v) − l(u,v) and add a super-source/super-sink to balance excesses and deficits. If a feasible solution exists in the reduced network, adding back the pre-routed flows gives a valid circulation in the original network satisfying all bounds. The final flow on edge (u,v) is l(u,v) plus the flow found in the reduced graph.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },

  // ── Edge-Disjoint Paths / Menger ──────────────────────────────────────────
  {
    id: 'edge-disjoint-paths',
    name: "Edge-Disjoint Paths / Menger's Theorem",
    course: 'INF234',
    category: 'Flow',
    description: 'Finds the maximum number of edge-disjoint s-t paths, equal to the minimum s-t edge cut, via unit-capacity max-flow.',
    complexity: {
      time: { worst: 'O(VE)' },
      space: 'O(V + E)',
    },
    pseudocode: `EdgeDisjointPaths(G, s, t):
  Assign capacity 1 to all edges
  maxFlow ← FordFulkerson(G, s, t)
  return maxFlow
  // = max number of edge-disjoint s-t paths
  // = min edges separating s from t (Menger)

// Node-disjoint variant:
  Split each internal node v into
    v_in → v_out with capacity 1
  Run max-flow on split graph`,
    explanation: `Menger's theorem (edge version): the maximum number of edge-disjoint s-t paths equals the minimum number of edges whose removal disconnects s from t. This follows directly from max-flow min-cut: assign capacity 1 to every edge and run max-flow. Each unit of flow is an edge-disjoint path; the minimum cut gives the minimum edge cut. For node-disjoint paths (paths sharing no internal node), split each internal node v into v_in → v_out with capacity 1, enforcing that each node is used by at most one path. The resulting max-flow gives the maximum number of internally node-disjoint paths, equal to the minimum number of internal nodes that separate s from t.`,
    visualizerType: 'none',
    defaultInput: null,
    generateSteps: () => [],
    randomize: () => null,
  },
];
