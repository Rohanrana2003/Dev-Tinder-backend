const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Please enter a valid email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "about",
    "age",
    "gender",
    "photoUrl",
    "skills",
  ];

  const isValidData = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isValidData;
};

module.exports = { validateSignUpData, validateEditData };
