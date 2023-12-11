const express = require("express");
const ctrl = require("../../controllers/contacts");
const { isValidId, validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");

const router = express.Router();

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, isValidId, ctrl.getById);

router.post("/", authenticate, validateBody(schemas.postSchema), ctrl.add);

router.put(
  "/:contactId",
  authenticate,
  validateBody(schemas.addSchema),
  isValidId,
  ctrl.updateById
);

router.delete("/:contactId", authenticate, isValidId, ctrl.deleteById);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateFavorite
);

module.exports = router;
