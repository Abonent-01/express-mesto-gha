const router = require('express').Router();
const { getUsers, createUser, getUser, updateUserProfile, updateUserAvatar } = require("../controllers/users");

router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;