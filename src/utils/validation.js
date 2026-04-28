const validator = require("validator");

const validateSignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName) {
    throw new Error("please enter firstname");
  } else if (
    firstName.length < 3 ||
    firstName.length > 20 ||
    lastName?.length > 20
  ) {
    throw new Error("Name must be betweeen 3-50 char");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("enter a valid email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(`Password must be at least 8 characters.
Include uppercase, lowercase, number & special character.`);
  }
};

const validateProfileEditInfo = (req) => {
  const allFields = req.body;
  const ALLOWED_FIELDS = [
    "role",
    "photoUrl",
    "linkedIn",
    "about",
    "skills",
    "lastName",
  ];
  const isAllowed = Object.keys(allFields).every((field) =>
    ALLOWED_FIELDS.includes(field),
  );
  return isAllowed;
};

module.exports = { validateSignUp, validateProfileEditInfo };
