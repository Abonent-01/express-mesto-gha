const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const ERROR_CODE_DUPLICATE = require('../error/duplicateError');
const ERROR_CODE_AUTH = require('../error/authError');
const ERROR_CODE_NOT_FOUND = require('../error/notFoundError')

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ERROR_CODE_NOT_FOUND('User not found');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ERROR_CODE_WRONG_DATA('Invalid user ID'));
      } else if (err.message === 'NotFound') {
        next (new ERROR_CODE_NOT_FOUND('Can`t find user'));
      } else {
      next(err);
      }
    });
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, about, avatar, email, password: hashedPassword });
    res.send(user.toJSON());
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new ERROR_CODE_WRONG_DATA('Invalid user data'));
    } else if (err.code === 11000) {
      next(new ERROR_CODE_DUPLICATE('User already exists'));
    } else {
      next(err);
    }
  }
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