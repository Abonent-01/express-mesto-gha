const Card = require('../models/card');
const cardSchema = require('../models/card');

const ERROR_CODE_WRONG_DATA = require('../error/wrongDataError');
const ERROR_CODE_NOT_FOUND = require('../error/notFoundError');
const ERROR_CODE_FORBIDDEN = require('../error/forbiddenError');

module.exports.getCards = (req, res, next) => {
  cardSchema
    .find({})
    .then((cards) => res.status(200)
      .send(cards))
    .catch(next);
};

module.exports.createCard = (request, response, next) => {
  const {
    name,
    link,
  } = request.body;
  const owner = request.user._id;

  cardSchema
    .create({
      name,
      link,
      owner,
    })
    .then((card) => response.status(201)
      .send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_CODE_NOT_FOUND('Error...'));
      } else {
        next(err);
      }
    });
};


module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new ERROR_CODE_NOT_FOUND("Not Found"))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        res.status(ERROR_CODE_WRONG_DATA).send({ message: `Error...` });
        card.deleteOne(card)
          .then((cards) => res.send(cards))
          .catch(next)
      } else {
        throw new ERROR_CODE_FORBIDDEN(`Error...`);
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
        next(res.send(card));
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
        throw new ERROR_CODE_NOT_FOUND(`Error...`)
      } else {
        next(res.send(card));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new ERROR_CODE_WRONG_DATA(`Error...`));
      } else {
        next(err);
      }
    })
};