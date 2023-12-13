const { Contact, schemas } = require("../models/contact");
const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner })
    .skip(skip)
    .limit(limit)
    .populate("owner", "email");
  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const requiredFields = ["name", "email", "phone"];
  for (const field of requiredFields) {
    if (req.body[field] === undefined) {
      return res
        .status(400)
        .json({ message: `missing required ${field} field` });
    }
  }

  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }

  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }

  res.status(200).json(updatedContact);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateFavorite = async (req, res) => {
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
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
  updateFavorite: ctrlWrapper(updateFavorite),
};
