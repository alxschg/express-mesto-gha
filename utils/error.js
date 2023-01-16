function handleError(err, req, res) {
  if (err.name === 'CastError') {
    res.status(400).send({
      message: 'Переданы некорректные данные',
    });
  } else if (err.name === 'ValidationError') {
    res.status(400).send({
      message: err.message,
    });
  } else if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      message: err.message,
    });
  } else if (err.name === 'NotFoundError') {
    res.status(404).send({
      message: err.message,
    });
  } else {
    res.status(500).send({
      message: 'Ошибка по-умолчанию',
    });
  }
}

module.exports = { handleError };
