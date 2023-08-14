const Card = require('../models/card');

const ERROR_CODE_WRONG_DATA = require('../error/wrongDataError');
const ERROR_CODE_NOT_FOUND = require('../error/notFoundError');
const ERROR_CODE_FORBIDDEN = require('../error/forbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;
  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card.toJSON())) // Send the card object with _id
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ERROR_CODE_WRONG_DATA(`ValidationError`));
      } else {
        next(err);
      }
    });
}



module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new ERROR_CODE_NOT_FOUND(`Error...`))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        res.send(card); // Just send the card if ownership is validated
      } else {
        throw new ERROR_CODE_FORBIDDEN('Error...')
      }
    })
    .catch(next);
};


module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new ERROR_CODE_NOT_FOUND('Error...');
      } else {
        res.send(card); // Send the card as a response
      }
    })
    .catch((err) =>{
      if (err.name === "CastError") {
        next(new ERROR_CODE_WRONG_DATA('Error...'))
      } else {
        next(err);
      }
    })
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card not found' });
      } else {
        res.send(card); // Send the card as a response
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ERROR_CODE_WRONG_DATA(`Error...`));
      } else {
        next(err);
      }
    });
};
