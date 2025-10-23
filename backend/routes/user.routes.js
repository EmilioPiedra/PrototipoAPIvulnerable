const express = require("express");
const router = express.Router();
const { getUserById , updateUserById} = require("../controllers/user.controller");


router.get('/:id', getUserById);
router.put("/:id", updateUserById);

module.exports = router;
