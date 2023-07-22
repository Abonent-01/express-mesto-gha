const Card = require('../models/card');

const ERROR_CODE_WRONG_DATA = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_DEFAULT = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(err => {
      res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message });
    })
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name = "ValidationError") {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        return;
      } else {
        res.status(ERROR_CODE_DEFAULT).send({ message: `Error...`, err: err.message });
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