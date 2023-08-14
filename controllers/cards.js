const Card = require('../models/card');

const ERROR_CODE_WRONG_DATA = require('../error/wrongDataError');
const ERROR_CODE_NOT_FOUND = require('../error/notFoundError');
const ERROR_CODE_DEFAULT = require('../error/defaultError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name = "ValidationError") {
        next(new ERROR_CODE_WRONG_DATA(`Error...`));
      } else {
        next(err);
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else if (err.name = "Not Found") {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message });
      }
    })
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else if (err.name = "Not Found") {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).sendsend({ message: `Error...`, err: err.message });
      }
    })
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else if (err.name = "Not Found") {
        res.status(ERROR_CODE_NOT_FOUND).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).sendsend({ message: `Error...`, err: err.message });
      }
    })
};