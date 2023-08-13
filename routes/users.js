const router = require('express').Router();
const { validateUserId, validateUpdateProfile, validateUpdateAvatar } = require('../middlewares/validate');
const { getUsers, getUserInfo, getUser, updateUserProfile, updateUserAvatar } = require("../controllers/users");

router.get('/', getUsers);
router.get('/me', getUserInfo);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUpdateProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;