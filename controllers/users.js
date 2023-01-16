const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');

const SALT_LENGTH = 10;

async function getUser(req, res, next) {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Неверные данные'));
      return;
    }
    next(err);
  }
}

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      email,
      password,
      name,
      about,
      avatar,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, SALT_LENGTH);

    let user = await User.create({
      email,
      password: passwordHash,
      name,
      about,
      avatar,
    });

    user = user.toObject();
    delete user.password;
    res.status(201).send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new ValidationError('Неверные данные'));
      return;
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
      return;
    }

    next(err);
  }
}

const updateUserData = (res, req) => {
  const {
    user: { _id },
    body,
  } = req;
  User.findByIdAndUpdate(_id, body, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь по заданному id отсутствует в базе');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
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
    return res
      .status(400)
      .send({ message: 'Поле "name" и "about" должны быть заполнено' });
  }
  return updateUserData(res, req);
};

const updateAvatar = (req, res) => {
  const { body } = req;
  if (!body.avatar) {
    return res
      .status(400)
      .send({ message: 'Поле "avatar" должно быть заполнено' });
  }
  return updateUserData(res, req);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user === null) {
        throw new UnauthorizedError('Неправильная почта или пароль');
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильная почта или пароль');
          } const token = jwt.sign({ _id: user._id }, 'secretkey', { expiresIn: '7d' });
          res.send({ jwt: token });
        });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
