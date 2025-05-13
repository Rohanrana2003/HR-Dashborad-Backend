const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const Candidate = require("../models/Candidate");

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

// Updating employee data
employeeRouter.patch(())
module.exports = employeeRouter;
