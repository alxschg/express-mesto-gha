const express = require('express');
const {
  getUser,
  getAllUsers,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

const users = express.Router();

users.get('/', getAllUsers);
users.get('/:userId', getUser);
users.post('/', createUser);
users.patch('/me/avatar', express.json(), updateAvatar);
users.patch('/me', express.json(), updateUser);

module.exports = { users };
