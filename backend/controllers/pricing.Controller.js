const Pricing = require("../models/Pricing");


/* ================= CREATE PLAN ================= */
exports.createPlan = async (req, res) => {
  try {

    const {
      planName,
      planPrice,
      planDescription,
      planFeatures
    } = req.body;

    const pricing = await Pricing.create({
      planName,
      planPrice,
      planDescription,
      planFeatures,
    });

    res.status(201).json({
      success: true,
      message: "Pricing plan created",
      pricing,
    });

  } catch (error) {

    console.error("Create Pricing Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



/* ================= GET ALL PLANS ================= */
exports.getPlans = async (req, res) => {
  try {

    const plans = await Pricing.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      plans,
    });

  } catch (error) {

    console.error("Get Pricing Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



/* ================= GET SINGLE PLAN ================= */
exports.getPlanById = async (req, res) => {
  try {

    const plan = await Pricing.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.status(200).json({
      success: true,
      plan,
    });

  } catch (error) {

    console.error("Get Single Pricing Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



/* ================= UPDATE PLAN ================= */
exports.updatePlan = async (req, res) => {
  try {

    const {
      planName,
      planPrice,
      planDescription,
      planFeatures
    } = req.body;

    const updatedPlan = await Pricing.findByIdAndUpdate(
      req.params.id,
      {
        planName,
        planPrice,
        planDescription,
        planFeatures,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plan updated successfully",
      updatedPlan,
    });

  } catch (error) {

    console.error("Update Pricing Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



/* ================= DELETE PLAN ================= */
exports.deletePlan = async (req, res) => {
  try {

    const deletedPlan = await Pricing.findByIdAndDelete(req.params.id);

    if (!deletedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Plan deleted successfully",
    });

  } catch (error) {

    console.error("Delete Pricing Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};