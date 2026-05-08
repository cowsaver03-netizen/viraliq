const Customer = require("../models/Customer");


/* ================= CREATE CUSTOMER ================= */

exports.createCustomer = async (req, res) => {

  try {

    const {
      name,
      phone,
      plan,
      amount,
      paymentMethod,
      status
    } = req.body;

    const customer = await Customer.create({
      name,
      phone,
      plan,
      amount,
      paymentMethod,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });

  } catch (error) {

    console.error("Create Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};



/* ================= GET ALL CUSTOMERS ================= */

exports.getCustomers = async (req, res) => {

  try {

    const customers = await Customer.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      customers,
    });

  } catch (error) {

    console.error("Get Customers Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};



/* ================= GET SINGLE CUSTOMER ================= */

exports.getCustomerById = async (req, res) => {

  try {

    const customer = await Customer.findById(req.params.id);

    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    }

    res.status(200).json({
      success: true,
      customer,
    });

  } catch (error) {

    console.error("Get Single Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};



/* ================= UPDATE CUSTOMER ================= */

exports.updateCustomer = async (req, res) => {

  try {

    const {
      name,
      phone,
      plan,
      amount,
      paymentMethod,
      status
    } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(

      req.params.id,

      {
        name,
        phone,
        plan,
        amount,
        paymentMethod,
        status,
      },

      {
        new: true,
        runValidators: true,
      }

    );

    if (!updatedCustomer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      updatedCustomer,
    });

  } catch (error) {

    console.error("Update Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};



/* ================= DELETE CUSTOMER ================= */

exports.deleteCustomer = async (req, res) => {

  try {

    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);

    if (!deletedCustomer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });

    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
    });

  } catch (error) {

    console.error("Delete Customer Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }

};