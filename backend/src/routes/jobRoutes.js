import express from "express";
import {
  createJob,
  getAllJobs,
  searchJob,
  filterJobByLocation,
  getDashboardStats,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

// ── Static routes FIRST (before /:id) ──────────────────
router.get("/stats", getDashboardStats);   // must be above /:id
router.get("/search", searchJob);
router.get("/location", filterJobByLocation);

// ── Base routes ─────────────────────────────────────────
router.get("/", getAllJobs);
router.post("/", createJob);

// ── Dynamic :id routes LAST ──────────────────────────────
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;