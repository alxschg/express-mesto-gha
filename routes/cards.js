const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateId } = require('../utils/validateId');
const {
  createCard,
  getAllCards,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

const cards = express.Router();

cards.get('/', getAllCards);
cards.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/https?:\/\/(www\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);
cards.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().custom(validateId, 'ObjectId validation'),
    }),
  }),
  deleteCard,
);
cards.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().custom(validateId, 'ObjectId validation'),
    }),
  }),
  putLike,
);
cards.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().custom(validateId, 'ObjectId validation'),
    }),
  }),
  deleteLike,
);

module.exports = { cards };
