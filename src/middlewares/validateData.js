const validator = require("validator");

const validCandidate = (req, res, next) => {
  const { name, email, phone, position, experience } = req.body;

  // Name
  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ message: "Name must be at least 2 characters" });
  }

  // Email
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Phone
  if (!phone || !validator.isMobilePhone(phone, "any")) {
    return res.status(400).json({ message: "Invalid phone number" });
  }

  // Position
  if (!position || position.trim().length < 2) {
    return res.status(400).json({ message: "Position is required" });
  }

  // Experience (optional, but must be a non-negative number if provided)
  if (
    experience &&
    (!validator.isNumeric(experience.toString()) || experience < 0)
  ) {
    return res
      .status(400)
      .json({ message: "Experience must be a non-negative number" });
  }

  next(); // All validations passed
};

const validEditEmployeeData = (req) => {
  const allowedFeilds = [
    "name",
    "email",
    "phone",
    "department",
    "position",
    "dateOfJoining",
  ];

  const isValidData = Object.keys(req.body).every((field) =>
    allowedFeilds.includes(field)
  );

  return isValidData;
};

module.exports = { validCandidate, validEditEmployeeData };
