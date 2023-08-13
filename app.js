const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');


const ERROR_CODE_NOT_FOUND = 404;


const auth = require('./middlewares/auth');
const { createUser, login } = require('./middlewares/auth');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');


const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express();
app.use(express.json());
app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use(auth);
app.use(router);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');


app.listen(PORT, () => {
    // Если всё работает, консоль покажет, какой порт приложение слушает
    console.log(`App listening on port ${PORT}`)
})