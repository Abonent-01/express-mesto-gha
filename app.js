const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const ERROR_CODE_WRONG_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express();
app.use(express.json());
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);


/*
app.use((req, res, next) => {
  req.user = {
    _id: '64bb8d55f97f6d2d5b8a4f52' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
*/

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(router);
app.use('/', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Error...'});
});



app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})