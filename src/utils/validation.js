const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("please enter first and last name");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("length must be betweeen 4-50 char");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("enter a valid email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong password");
  }
};

const validateProfileEditInfo = (req) => {
  const allFields = req.body;
  const ALLOWED_FIELDS = ["age", "photoUrl", "about", "skills"];
  const isAllowed = Object.keys(allFields).every((field) =>
    ALLOWED_FIELDS.includes(field),
  );
  return isAllowed;
};

module.exports = { validateSignUp, validateProfileEditInfo };
