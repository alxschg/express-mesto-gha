const { Card } = require('../models/card');
const { handleError } = require('../utils/error');

async function createCard(req, res) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.send(card);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function getAllCards(req, res) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function deleteCard(req, res) {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }

    res.send(card);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function deleteLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } }, // убрать _id из массива, если он есть
      { new: true },
    );
    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }
    res.send(card);
  } catch (err) {
    handleError(err, req, res);
  }
}

async function putLike(req, res) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      const error = new Error('Карточка не найдена');
      error.name = 'NotFoundError';
      throw error;
    }
    res.send(card);
  } catch (err) {
    handleError(err, req, res);
  }
}

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  deleteLike,
  putLike,
};
