const express = require("express");
const ctrl = require("../../controllers/auth");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const router = express.Router();
const upload = require("../../multer-config");

router.post(
  "/register",
  upload.single("avatar"),
  validateBody(schemas.registerSchema),
  ctrl.register
);

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
