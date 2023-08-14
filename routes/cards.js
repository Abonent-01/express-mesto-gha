const router = require('express').Router();
const { validateCreateCard, validateDeleteCard, validateDislikeCard, validateLikeCard } = require('../middlewares/validate');
const { getCards, createCard, deleteCard, likeCard, dislikeCard, } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.delete('/:cardId/likes', validateDislikeCard, dislikeCard);
router.put('/:cardId/likes', validateLikeCard, likeCard);

module.exports = router;