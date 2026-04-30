const express = require("express");
const cors = require("cors");
const routeRouter = require("./route");

const app = express();
const PORT = 3000;

// ── Middleware ────────────────────────────────────────────────────────────────

// Enable CORS so the frontend (served from a different origin / file://)
// can call this API without being blocked by the browser's same-origin policy.
app.use(cors({
  origin: "*",                   // allow all origins (fine for local dev)
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/", routeRouter);

// Health-check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Delivery Route Optimizer API is running." });
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚚  Delivery Route Optimizer API`);
  console.log(`   Server running at http://localhost:${PORT}`);
  console.log(`   POST /optimize-route  →  find minimum cost path\n`);
});
