const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user')

const ERROR_CODE_WRONG_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;
const ERROR_CODE_DUPLICATE = require('../error/duplicateError');
const ERROR_CODE_AUTH = 401;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_NOT_FOUND('Error...');
      } else {
        next(res.send(user));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ERROR_CODE_WRONG_DATA(`Error...`));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({ name, about, avatar, email, password }))

    .then((user) => res.send(user.toJSON()))
    .catch((err) => {
      // Handle database-related errors
      if (err.name === "ValidationError") {
        return next(new ERROR_CODE_WRONG_DATA('Validation error'));
      } else if (err.code === 11000) {
        return next(new ERROR_CODE_DUPLICATE('Duplicate email'));
      }
      // Handle other errors
      return next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ERROR_CODE_WRONG_DATA(`Error...`));
      } else {
        next(new ERROR_CODE_DEFAULT(`Error...`));
      }
    })
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message })
      }
    })
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new ERROR_CODE_AUTH('Error...'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, 'SECRET');
            res.cookie('jwt', jwt, {
              maxAge: 36000000,
              httpOnly: true,
              sameSite: true,
            })
            res.send(user)
          } else {
            throw new ERROR_CODE_AUTH('Error...');
          }
        })
        .catch(next);
    })
    .catch(next);
}

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
  .orFail(new ERROR_CODE_NOT_FOUND('Error...'))
  .then((user) => res.send(user))
  .catch((err) => next(err));
}