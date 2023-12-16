const validateBody = require("./validateBody");
const isValidId = require("./isValidId");
const authenticate = require("./authenticate");
const upload = require("./multer-config");
module.exports = {
  isValidId,
  validateBody,
  authenticate,
  upload,
};
