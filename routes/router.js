const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateCreateUser, validateLogin } = require('../middlewares/validate');

const ERROR_CODE_NOT_FOUND = 404;

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new ERROR_CODE_NOT_FOUND('Error...'))
});

module.exports = router;