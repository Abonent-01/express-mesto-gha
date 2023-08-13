const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/router');

const ERROR_CODE_WRONG_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

const auth = require('./middlewares/auth');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');
const { createUser, login } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());


app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);




app.use(auth);


app.use(router);


mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use('/', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Error...' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
