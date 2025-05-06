const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const statisticsController = require("../controllers/statisticsController");
// Routes protégées par authentification
router.post("/createComplaint", complaintController.createComplaint);
router.get("/getAllComplaints", complaintController.getAllComplaints);
router.get("/getComplaintById/:id", complaintController.getComplaintById);
router.put("/updateComplaint/:id", complaintController.updateComplaint);
router.delete("/deleteComplaint/:id", complaintController.deleteComplaint);

module.exports = router;
