const { findMinCostPath } = require("./dpAlgorithm");

/**
 * optimizeRoute
 * -------------
 * Controller for POST /optimize-route
 * Validates input, delegates to DP algorithm, returns result.
 */
function optimizeRoute(req, res) {
  try {
    const { graph, start, end } = req.body;

    // ── Input Validation ──────────────────────────────────────────────────────
    if (!Array.isArray(graph) || graph.length === 0) {
      return res.status(400).json({ error: "graph must be a non-empty 2D array." });
    }

    const n = graph.length;

    for (let i = 0; i < n; i++) {
      if (!Array.isArray(graph[i]) || graph[i].length !== n) {
        return res.status(400).json({ error: `Row ${i} of graph is invalid. Must be a square matrix.` });
      }
    }

    if (typeof start !== "number" || typeof end !== "number") {
      return res.status(400).json({ error: "start and end must be numbers." });
    }

    if (start < 0 || start >= n || end < 0 || end >= n) {
      return res.status(400).json({ error: `start and end must be between 0 and ${n - 1}.` });
    }

    // ── Run DP ────────────────────────────────────────────────────────────────
    const result = findMinCostPath(graph, start, end);

    if (result.minCost === -1) {
      return res.status(200).json({
        minCost: -1,
        path: [],
        message: "No path found between the specified nodes.",
      });
    }

    return res.status(200).json({
      minCost: result.minCost,
      path: result.path,
    });

  } catch (err) {
    console.error("Error in optimizeRoute:", err.message);
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}

module.exports = { optimizeRoute };
