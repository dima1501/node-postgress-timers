const express = require("express");
const router = express.Router();

router.use("/", require("./TimerRoutes"));
router.use("/", require("./AuthRoutes"));

module.exports = router;
