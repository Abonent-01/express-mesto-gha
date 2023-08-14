const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/router');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

const app = express();
app.use(express.json());
app.use(cookieParser());

/*mongoose.connect('mongodb://127.0.0.1:27017/mestodb');*/

app.use(router);
app.use(errors());
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    await app.listen(PORT);
  } catch (err) {
    console.log(err);
  }
}

start()
  .then(() => console.log(`App has been successfully started!\n${'mongodb://127.0.0.1:27017/mestodb'}\nPort: ${PORT}`));