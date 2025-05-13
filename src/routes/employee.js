const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Candidate = require("../models/Candidate");
const { validEditEmployeeData } = require("../middlewares/validateData");

const employeeRouter = express();

// fetching all employess API
employeeRouter.get("/employees", userAuth, async (req, res) => {
  try {
    const employees = await Candidate.find({ status: "Selected" });

    if (!employees) {
      res.json({ message: "No employees to show" });
    }

    res.json({ message: "Fteched employees successfully", data: employees });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error in fetching employees", error: err.message });
  }
});

// Updating employee data API
employeeRouter.patch(
  "/employees/updateEmployee",
  userAuth,
  async (req, res) => {
    try {
      if (!validEditEmployeeData(req)) {
        throw new Error("Invalid Data updation");
      }
      const { email } = req.body;

      const employee = await Candidate.findOne({ email: email });

      if (!employee) {
        throw new Error("employee not found with this email");
      }
      const id = employee._id;

      // New true here will return updated user
      const updatedEmployee = await Candidate.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      res.json({
        message: "Profile get updated successfully!",
        data: updatedEmployee,
      });
    } catch (err) {
      res.status(400).json({
        message: "Error in updating Employee Data",
        error: err.message,
      });
    }
  }
);
module.exports = employeeRouter;
