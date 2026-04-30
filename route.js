const express = require("express");
const router = express.Router();
const { optimizeRoute } = require("./routeController");

// POST /optimize-route
// Body: { graph: number[][], start: number, end: number }
router.post("/optimize-route", optimizeRoute);

module.exports = router;
