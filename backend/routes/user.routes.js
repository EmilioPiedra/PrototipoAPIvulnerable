const express = require("express");
const router = express.Router();
const { getUserById, updateUserById } = require("../controllers/user.controller");
const { protect } = require('../middlewares/auth.middleware');

router.get('/:id', protect, getUserById);
router.put("/:id", protect, updateUserById);

module.exports = router;