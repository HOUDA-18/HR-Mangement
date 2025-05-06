const mongoose = require("mongoose");

const statisticsSchema = new mongoose.Schema(
  {
    complaintPending: {
      type: Number,
      default: 0,
    },
    complaintProgress: { type: Number, default: 0 },
    complaintResolved: { type: Number, default: 0 },
    complaintRejected: { type: Number, default: 0 },
    complaintTotal: { type: Number, default: 0 },
  },
  {
    timestamps: true, // ajoute automatiquement createdAt et updatedAt
  }
);

module.exports = mongoose.model("Statistics", statisticsSchema);
