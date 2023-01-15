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

async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true },
      { runValidators: true },
    );
    res.send(user);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function updateAvatar(req, res) {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true },
    );
    res.send(user);
  } catch (err) {
    handleError(err, req, res);
  }
}

module.exports = {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  updateAvatar,
};
