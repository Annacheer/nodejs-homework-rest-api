const express = require("express");
const { Contact, schemas } = require("../../models/contact");
const { HttpError } = require("../../helpers");
const isValidId = require("../../middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const requiredFields = ["name", "email", "phone"];
    for (const field of requiredFields) {
      if (req.body[field] === undefined) {
        return res
          .status(400)
          .json({ message: `missing required ${field} field` });
      }
    }

    const { error } = schemas.postSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", isValidId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", isValidId, async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }

    const { error } = schemas.addSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { contactId } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", isValidId, async (req, res, next) => {
  try {
    if (req.body.favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const { error } = schemas.updateFavoriteSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { contactId } = req.params;
    const updateStatusContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );

    if (!updateStatusContact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(updateStatusContact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
