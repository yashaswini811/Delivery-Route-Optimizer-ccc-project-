/**
 * Delivery Route Cost Optimizer - Dynamic Programming Core
 * =========================================================
 * Uses Memoization (Top-Down DP) to find the minimum cost path
 * between two nodes in a weighted graph.
 *
 * DP Concepts Applied:
 *  - Overlapping Subproblems: Same node visits are cached in `memo`
 *  - Optimal Substructure: min_cost(u→v) = min over neighbors w of (cost(u,w) + min_cost(w→v))
 *  - Memoization: Results stored in a Map keyed by (node, visitedMask)
 */

const INF = Infinity;

/**
 * findMinCostPath
 * ---------------
 * Finds the minimum cost and corresponding path from `start` to `end`
 * in a weighted graph represented as an adjacency matrix.
 *
 * @param {number[][]} graph   - Adjacency matrix; graph[i][j] = cost, 0 = no edge (unless i===j)
 * @param {number}     start   - Source node index
 * @param {number}     end     - Destination node index
 * @returns {{ minCost: number, path: number[] }}
 */
function findMinCostPath(graph, start, end) {
  const n = graph.length;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!graph || n === 0) throw new Error("Graph cannot be empty.");
  if (start < 0 || start >= n) throw new Error(`Start node ${start} is out of range.`);
  if (end   < 0 || end   >= n) throw new Error(`End node ${end} is out of range.`);
  if (start === end) return { minCost: 0, path: [start] };

  // ── Memoization Table ────────────────────────────────────────────────────────
  // Key: "currentNode,visitedBitmask"
  // Value: minimum cost from currentNode to `end`, given already-visited nodes
  const memo = new Map();

  // ── Recursive DP with Memoization ────────────────────────────────────────────
  /**
   * dp(node, visited) → minimum cost to reach `end` from `node`
   *                     without re-visiting any node in `visited`.
   *
   * Base case  : node === end  →  cost is 0
   * Rec case   : try all unvisited neighbors w where edge exists,
   *              pick the one giving minimum (edge_cost + dp(w, visited | (1<<w)))
   */
  function dp(node, visited) {
    // Base case: reached destination
    if (node === end) return 0;

    // DP overlapping-subproblem check: have we solved this state?
    const key = `${node},${visited}`;
    if (memo.has(key)) return memo.get(key);

    let best = INF;

    // Explore all neighbors
    for (let next = 0; next < n; next++) {
      const edgeCost = graph[node][next];

      // Skip: no edge, self-loop, or already visited
      if (edgeCost === 0 || next === node) continue;
      if (visited & (1 << next)) continue;       // bitmask visited check

      // Recurse: mark `next` as visited, accumulate cost
      const subResult = dp(next, visited | (1 << next));

      if (subResult !== INF) {
        best = Math.min(best, edgeCost + subResult);
      }
    }

    // Store result in memo table (memoization)
    memo.set(key, best);
    return best;
  }

  // ── Run DP ──────────────────────────────────────────────────────────────────
  const initialVisited = 1 << start;           // mark start as visited
  const minCost = dp(start, initialVisited);

  if (minCost === INF) {
    return { minCost: -1, path: [] };           // no path exists
  }

  // ── Path Reconstruction ──────────────────────────────────────────────────────
  // Walk forward, greedily choosing the neighbor that gives the memoized optimum
  const path = [start];
  let current = start;
  let visited = initialVisited;

  while (current !== end) {
    let bestNext = -1;
    let bestCost = INF;

    for (let next = 0; next < n; next++) {
      const edgeCost = graph[current][next];
      if (edgeCost === 0 || next === current) continue;
      if (visited & (1 << next)) continue;

      const subKey = `${next},${visited | (1 << next)}`;
      const subCost = next === end ? 0 : (memo.get(subKey) ?? INF);

      if (subCost !== INF && edgeCost + subCost < bestCost) {
        bestCost = edgeCost + subCost;
        bestNext = next;
      }
    }

    if (bestNext === -1) break;                 // safety guard
    visited |= (1 << bestNext);
    path.push(bestNext);
    current = bestNext;
  }

  return { minCost, path };
}

module.exports = { findMinCostPath };
