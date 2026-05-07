const express = require("express");

const router = express.Router();

const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} = require("../controllers/pricing.Controller");


/* ================= ROUTES ================= */

// CREATE
router.post("/", createPlan);

// GET ALL
router.get("/", getPlans);

// GET SINGLE
router.get("/:id", getPlanById);

// UPDATE
router.put("/:id", updatePlan);

// DELETE
router.delete("/:id", deletePlan);


module.exports = router;