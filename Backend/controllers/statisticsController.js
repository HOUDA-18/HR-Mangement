const Statistics = require("../models/Statistics");
const Complaint = require("../models/Complaint");

exports.getStatistics = async (req, res) => {
  try {
    // Check if Statistics model is defined
    if (!Statistics) {
      return res
        .status(500)
        .json({ message: "Statistics model is not defined" });
    }

    const statistics = await Statistics.find();

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.genererStatistics = async () => {
  try {
    const [
      pendingCount,
      progressCount,
      resolvedCount,
      rejectedCount,
      totalCount,
    ] = await Promise.all([
      Complaint.countDocuments({ status: "pending" }),
      Complaint.countDocuments({ status: "in_progress" }),
      Complaint.countDocuments({ status: "resolved" }),
      Complaint.countDocuments({ status: "rejected" }),
      Complaint.countDocuments({}),
    ]);

    const statsData = {
      complaintPending: pendingCount,
      complaintProgress: progressCount,
      complaintResolved: resolvedCount,
      complaintRejected: rejectedCount,
      complaintTotal: totalCount,
    };

    // Check if Statistics model is defined
    if (!Statistics) {
      throw new Error("Statistics model is not defined");
    }

    // Upsert: update if exists, otherwise create
    const statistics = await Statistics.findOneAndUpdate(
      {}, // if only one global document
      statsData,
      { new: true, upsert: true }
    );

    return statistics;
  } catch (error) {
    console.error("Error generating statistics:", error);
    throw error;
  }
};
