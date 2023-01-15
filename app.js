const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Database connected.');
  })
  .catch((err) => {
    console.log('Error on database connection');
    console.error(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '63c32f855677c9cf44181242',
  };

  next();
});
app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log('App started.');
});
