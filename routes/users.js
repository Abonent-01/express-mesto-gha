const router = require('express').Router();
const { validateUpdateProfile, validateUpdateAvatar, validateUserId } = require('../middlewares/validate');
const { getUsers, getUser, updateUserProfile, updateUserAvatar } = require("../controllers/users");

router.get('/', getUsers);
router.get('/:userId', getUser);

router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUpdateProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;