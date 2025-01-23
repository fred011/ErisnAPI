const express = require("express");
const {
  createNotice,
  getAllNotices,
  updateNoticeWithId,
  deleteNoticeWithId,
} = require("../Controllers/notice.controller");

const router = express.Router();

router.post("/create", createNotice);
router.get("/all", getAllNotices);
router.patch("/update/:id", updateNoticeWithId);
router.delete("/delete/:id", deleteNoticeWithId);

module.exports = router;
