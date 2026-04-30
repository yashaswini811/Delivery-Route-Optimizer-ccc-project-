/**
 * RouteDP — Frontend Script
 * =========================
 * Handles:
 *  - Dynamic matrix rendering
 *  - Node name management
 *  - fetch() call to backend POST /optimize-route
 *  - Result display with animated path visual
 */

// ── Configuration ─────────────────────────────────────────────────────────────
const BACKEND_URL = "http://localhost:3000";   // backend server address

// ── State ─────────────────────────────────────────────────────────────────────
let nodeCount = 6;
let nodeNames = ["A", "B", "C", "D", "E", "F"];

// Pre-filled sample graph (6-node delivery network)
const SAMPLE_GRAPH = [
//  A   B   C   D   E   F
  [ 0, 10,  0, 30,  0,100],  // A
  [10,  0, 50,  0,  0,  0],  // B
  [ 0, 50,  0, 20,  0, 10],  // C
  [30,  0, 20,  0, 60,  0],  // D
  [ 0,  0,  0, 60,  0,  5],  // E
  [100, 0, 10,  0,  5,  0],  // F
];

// ── DOM References ─────────────────────────────────────────────────────────────
const matrixContainer   = document.getElementById("matrix-container");
const startSelect       = document.getElementById("start-node");
const endSelect         = document.getElementById("end-node");
const btnOptimize       = document.getElementById("btn-optimize");
const btnLoadSample     = document.getElementById("btn-load-sample");
const btnDec            = document.getElementById("btn-dec");
const btnInc            = document.getElementById("btn-inc");
const nodeCountDisplay  = document.getElementById("node-count-display");
const nodeNamesInput    = document.getElementById("node-names");
const loader            = document.getElementById("loader");
const resultCard        = document.getElementById("result-card");
const resultPlaceholder = document.getElementById("result-placeholder");
const resultContent     = document.getElementById("result-content");
const resultError       = document.getElementById("result-error");
const statNodes         = document.getElementById("stat-nodes");
const statEdges         = document.getElementById("stat-edges");

// ── Matrix Rendering ──────────────────────────────────────────────────────────

/**
 * Reads the current matrix values from DOM inputs.
 * Returns a 2D number array.
 */
function readMatrix() {
  const matrix = [];
  for (let i = 0; i < nodeCount; i++) {
    const row = [];
    for (let j = 0; j < nodeCount; j++) {
      const cell = document.getElementById(`cell-${i}-${j}`);
      row.push(cell ? (parseFloat(cell.value) || 0) : 0);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Renders the NxN matrix grid into #matrix-container.
 * Preserves existing values when resizing.
 */
function renderMatrix(preservedValues = null) {
  // Compute grid columns: 1 label col + N data cols
  matrixContainer.style.gridTemplateColumns =
    `40px repeat(${nodeCount}, 52px)`;
  matrixContainer.innerHTML = "";

  // Header row (blank corner + column labels)
  const corner = document.createElement("div");
  corner.className = "matrix-label";
  matrixContainer.appendChild(corner);

  for (let j = 0; j < nodeCount; j++) {
    const lbl = document.createElement("div");
    lbl.className = "matrix-label";
    lbl.textContent = nodeNames[j] || j;
    matrixContainer.appendChild(lbl);
  }

  // Data rows
  for (let i = 0; i < nodeCount; i++) {
    // Row label
    const rowLbl = document.createElement("div");
    rowLbl.className = "matrix-label";
    rowLbl.textContent = nodeNames[i] || i;
    matrixContainer.appendChild(rowLbl);

    for (let j = 0; j < nodeCount; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.min  = "0";
      input.id   = `cell-${i}-${j}`;
      input.className = "matrix-cell";

      if (i === j) {
        input.value = "0";
        input.classList.add("diagonal");
        input.disabled = true;
      } else {
        const val = preservedValues ? (preservedValues[i]?.[j] ?? 0) : 0;
        input.value = val || "";
        if (val > 0) input.classList.add("has-value");
      }

      // Live highlight for non-zero cells
      input.addEventListener("input", () => {
        const v = parseFloat(input.value);
        input.classList.toggle("has-value", v > 0);
        updateEdgeStat();
      });

      matrixContainer.appendChild(input);
    }
  }

  updateEdgeStat();
}

/** Loads the sample 6-node graph into the matrix. */
function loadSampleGraph() {
  nodeCount  = 6;
  nodeNames  = ["A", "B", "C", "D", "E", "F"];
  nodeCountDisplay.textContent = nodeCount;
  nodeNamesInput.value = nodeNames.join(",");
  statNodes.textContent = nodeCount;
  populateSelects();
  renderMatrix(SAMPLE_GRAPH);

  // Fill values from sample
  for (let i = 0; i < nodeCount; i++) {
    for (let j = 0; j < nodeCount; j++) {
      const cell = document.getElementById(`cell-${i}-${j}`);
      if (cell && i !== j) {
        cell.value = SAMPLE_GRAPH[i][j] || "";
        cell.classList.toggle("has-value", SAMPLE_GRAPH[i][j] > 0);
      }
    }
  }
  updateEdgeStat();
}

// ── Selects ───────────────────────────────────────────────────────────────────

function populateSelects() {
  [startSelect, endSelect].forEach(sel => {
    const prev = sel.value;
    sel.innerHTML = "";
    for (let i = 0; i < nodeCount; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${nodeNames[i] || i} (Node ${i})`;
      sel.appendChild(opt);
    }
    if (prev !== "" && prev < nodeCount) sel.value = prev;
  });
  // Default: start=0, end=last
  startSelect.value = 0;
  endSelect.value   = nodeCount - 1;
}

function updateEdgeStat() {
  const m = readMatrix();
  let edges = 0;
  for (let i = 0; i < nodeCount; i++)
    for (let j = i + 1; j < nodeCount; j++)
      if (m[i][j] > 0 || m[j][i] > 0) edges++;
  statEdges.textContent = edges;
}

// ── Node Count Spinner ────────────────────────────────────────────────────────

btnInc.addEventListener("click", () => {
  if (nodeCount >= 10) return;
  const preserved = readMatrix();
  nodeCount++;
  nodeNames = [...nodeNames.slice(0, nodeCount)];
  // Pad with default names
  const defaultNames = "ABCDEFGHIJ".split("");
  while (nodeNames.length < nodeCount) nodeNames.push(defaultNames[nodeNames.length]);
  nodeNamesInput.value = nodeNames.join(",");
  nodeCountDisplay.textContent = nodeCount;
  statNodes.textContent = nodeCount;
  // Expand preserved matrix
  const expanded = Array.from({ length: nodeCount }, (_, i) =>
    Array.from({ length: nodeCount }, (_, j) =>
      (i < preserved.length && j < preserved.length) ? preserved[i][j] : 0
    )
  );
  populateSelects();
  renderMatrix(expanded);
});

btnDec.addEventListener("click", () => {
  if (nodeCount <= 2) return;
  const preserved = readMatrix();
  nodeCount--;
  nodeNames = nodeNames.slice(0, nodeCount);
  nodeNamesInput.value = nodeNames.join(",");
  nodeCountDisplay.textContent = nodeCount;
  statNodes.textContent = nodeCount;
  const shrunk = preserved.slice(0, nodeCount).map(r => r.slice(0, nodeCount));
  populateSelects();
  renderMatrix(shrunk);
});

nodeNamesInput.addEventListener("input", () => {
  const parts = nodeNamesInput.value.split(",").map(s => s.trim()).filter(Boolean);
  for (let i = 0; i < nodeCount; i++) {
    nodeNames[i] = parts[i] || String(i);
  }
  // Re-render labels only (preserve values)
  const cur = readMatrix();
  populateSelects();
  renderMatrix(cur);
});

// ── Optimization (fetch to backend) ──────────────────────────────────────────

/**
 * Sends the graph, start, and end to the backend API.
 * Uses Dynamic Programming on the server to compute the optimal path.
 *
 * Endpoint : POST http://localhost:3000/optimize-route
 * Headers  : Content-Type: application/json
 * Body     : { graph: number[][], start: number, end: number }
 * Response : { minCost: number, path: number[] }
 */
async function optimizeRoute() {
  const graph = readMatrix();
  const start = parseInt(startSelect.value);
  const end   = parseInt(endSelect.value);

  // ── Validate locally before hitting API ──────────────────────────────────
  if (start === end) {
    showError("Start and end locations must be different.");
    return;
  }

  showLoader(true);
  hideResults();

  try {
    // ── fetch() call to Node.js backend ─────────────────────────────────────
    const response = await fetch(`${BACKEND_URL}/optimize-route`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",    // tell server we're sending JSON
      },
      body: JSON.stringify({ graph, start, end }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.error || "Server error. Check the backend console.");
      return;
    }

    if (data.minCost === -1) {
      showError(`No delivery path found from ${nodeNames[start]} to ${nodeNames[end]}.`);
      return;
    }

    showResult(data, graph);

  } catch (err) {
    // Likely backend not running
    showError(
      `Could not connect to backend at ${BACKEND_URL}.\n` +
      "Make sure Node.js server is running: cd backend && node server.js"
    );
  } finally {
    showLoader(false);
  }
}

// ── Result Display ────────────────────────────────────────────────────────────

function showResult(data, graph) {
  resultPlaceholder.classList.add("hidden");
  resultError.classList.add("hidden");
  resultContent.classList.remove("hidden");

  document.getElementById("result-cost").textContent = data.minCost;
  document.getElementById("meta-nodes").textContent  = data.path.length;
  document.getElementById("meta-path").textContent   = data.path.map(i => nodeNames[i]).join(" → ");

  // Build animated path visual
  const pathVisual = document.getElementById("path-visual");
  pathVisual.innerHTML = "";

  data.path.forEach((nodeIdx, i) => {
    const nodeEl = document.createElement("div");
    nodeEl.className = "path-node";
    nodeEl.textContent = nodeNames[nodeIdx] || nodeIdx;
    nodeEl.style.animationDelay = `${i * 80}ms`;
    pathVisual.appendChild(nodeEl);

    if (i < data.path.length - 1) {
      const nextIdx = data.path[i + 1];
      const edgeCost = graph[nodeIdx][nextIdx];

      const arrow = document.createElement("div");
      arrow.className = "path-arrow";
      arrow.textContent = "→";
      pathVisual.appendChild(arrow);

      if (edgeCost > 0) {
        const badge = document.createElement("span");
        badge.className = "path-cost-badge";
        badge.textContent = edgeCost;
        pathVisual.appendChild(badge);

        const arrow2 = document.createElement("div");
        arrow2.className = "path-arrow";
        arrow2.textContent = "→";
        pathVisual.appendChild(arrow2);
      }
    }
  });
}

function showError(msg) {
  resultPlaceholder.classList.add("hidden");
  resultContent.classList.add("hidden");
  resultError.classList.remove("hidden");
  document.getElementById("error-msg").textContent = msg;
}

function hideResults() {
  resultContent.classList.add("hidden");
  resultError.classList.add("hidden");
}

function showLoader(show) {
  loader.classList.toggle("hidden", !show);
  btnOptimize.disabled = show;
}

// ── Event Listeners ───────────────────────────────────────────────────────────
btnOptimize.addEventListener("click", optimizeRoute);
btnLoadSample.addEventListener("click", loadSampleGraph);

// ── Initialise ────────────────────────────────────────────────────────────────
loadSampleGraph();   // start with sample pre-filled
