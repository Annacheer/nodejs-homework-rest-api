const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const { SECRET_KEY } = process.env; //забираємо секретну строку зі змінних оточення process.env
// const fs = require("fs/promises");
// const path = require("path");

// const avatarDir = path.join(__dirname, "public", "avatars");

const register = async (req, res) => {
  console.log("req.file:", req.file);
  console.log("req.body:", req.body);

  // const { path: tempUpload, originalname } = req.file;
  // const resultUpload = path.join(avatarDir, originalname);
  // await fs.rename(tempUpload, resultUpload);
  const { email, password } = req.body;
  const user = await User.findOne({ email }); //чи немає такої людини вже в базі

  if (user) {
    throw HttpError(409, "Email in use"); //якщо є, то відсилаємо помилку
  }

  const hashPassword = await bcryptjs.hash(password, 10); //якщо немає, хешуємо пароль

  const newUser = await User.create({ ...req.body, password: hashPassword }); //зберігаємо користувача в базі, а пароль в захешованому вигляді

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body; //беремо імейл та пароль з тіла запиту
  const user = await User.findOne({ email }); //чи є користувач з таким імейлом в базі
  if (!user) {
    //якщо немає, відсилаємо помилку
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password); //якщо є такий користувач, то порівнюємо паролі - той, який прийшов з тим, що в базі
  if (!passwordCompare) {
    //якщо не співпали, це помилка:
    throw HttpError(401, "Email or password is wrong");
  }

  //якщо паролі співпадають, створюємо об'єкт payload, куди записуємо інформацію про користувача: це айді користувача
  const payload = {
    id: user._id,
  };
  //якщо паролі співпали, створюємо токен: (третій аргумент - об'єкт налаштувань - час життя токену)
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json("");
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
};
