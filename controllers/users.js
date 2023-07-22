const User = require('../models/user')

const ERROR_CODE_WRONG_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(err => {
      return res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error("Not Found"))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } if (err.message === "Not Found") {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: `Error...` });
        return;
      }
      res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message });
      return;
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message })
      }
    });
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message })
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
