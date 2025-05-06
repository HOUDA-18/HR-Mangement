const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

router.get("/getStatistics", statisticsController.getStatistics);
router.post("/generateStatistics", statisticsController.genererStatistics);
module.exports = router;
