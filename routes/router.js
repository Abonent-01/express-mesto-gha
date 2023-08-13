const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');



const ERROR_CODE_NOT_FOUND = 404;


router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new ERROR_CODE_NOT_FOUND('Error...'))
});

module.exports = router;