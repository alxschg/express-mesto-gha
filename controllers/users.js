const { User } = require('../models/user');
const { handleError } = require('../utils/error');

async function getUser(req, res) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('Пользователь не найден');
      error.name = 'NotFoundError';
      throw error;
    }
    res.send(user);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function createUser(req, res) {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    handleError(err, req, res);
  }
}

const updateUserData = (res, req) => {
  const { user: { _id }, body } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => {
      const error = new Error('Пользователь по заданному id отсутствует в базе');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Передан невалидный id пользователя' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

const updateUser = (req, res) => {
  const { body } = req;
  if (!body.name || !body.about) {
    return res.status(400).send({ message: 'Поле "name" и "about" должны быть заполнено' });
  }
  return updateUserData(res, req);
};

const updateAvatar = (req, res) => {
  const { body } = req;
  if (!body.avatar) {
    return res.status(400).send({ message: 'Поле "avatar" должно быть заполнено' });
  }
  return updateUserData(res, req);
};

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  updateAvatar,
};
