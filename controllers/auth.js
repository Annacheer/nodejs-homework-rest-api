const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const { SECRET_KEY } = process.env; //забираємо секретну строку зі змінних оточення process.env

const register = async (req, res) => {
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

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
};
