const express = require("express");
const router = express.Router();
const {login , register, changePassword , findEmail, allUsers} = require("../controller/userController.js")
const { protect } = require("../middleware/auth.js")

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/find-email").post(findEmail);
router.route("/change-password").put(changePassword);
router.route("/all-users").get(protect, allUsers)


module.exports = router;