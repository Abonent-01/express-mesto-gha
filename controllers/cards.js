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
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ERROR_CODE_WRONG_DATA('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const removeCard = () => {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => res.send(card))
      .catch(next);
  };

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) next(new ERROR_CODE_NOT_FOUND('Карточки не существует'));
      if (req.user._id === card.owner.toString()) {
        return removeCard();
      }
      return next(new ERROR_CODE_FORBIDDEN('Попытка удалить чужую карточку'));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new ERROR_CODE_NOT_FOUND(
            'Запрашиваемая карточка для добавления лайка не найдена',
          ),
        );
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new ERROR_CODE_NOT_FOUND(
            'Запрашиваемая карточка для удаления лайка не найдена',
          ),
        );
      }
      return res.send(card);
    })
    .catch(next);
};