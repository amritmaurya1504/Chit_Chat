const express = require("express");
const router = express.Router();
const {accessChats, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup} = require("../controller/chatControllers.js")
const { protect } = require("../middleware/auth.js")

router.route("/").post(protect , accessChats);
router.route("/").get(protect, fetchChats)
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/group-remove").put(protect, removeFromGroup);
router.route("/group-add").put(protect, addToGroup);



module.exports = router;