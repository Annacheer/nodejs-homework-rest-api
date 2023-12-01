// const { isValidObjectId } = require("mongoose");

// const { HttpError } = require("../helpers");

// const isValidId = (req, res, next) => {
//   const { contactId } = req.params;
//   if (!isValidObjectId(contactId)) {
//     next(HttpError(400, `${contactId} is not valid id`));
//   }
//   next();
// };

// module.exports = isValidId;

const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return res.status(400).json({ message: `${contactId} is not a valid id` });
  }
  next();
};
module.exports = isValidId;

// const isValidId = (req, res, next) => {
//   const { contactId } = req.params;
//   if (!isValidObjectId(contactId)) {
//     // Відправлення відповіді з помилкою
//     return res.status(400).json({ message: `${contactId} is not a valid id` });
//   }
//   next();
// };
