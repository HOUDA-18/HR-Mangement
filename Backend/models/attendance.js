const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    checkInTime: {
      type: Date,
      required: true
    },
    checkOutTime: {
      type: Date
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    distanceFromOffice: {
      type: Number
    },
    checkinIsInsideOffice: {
      type: Boolean,
      default: false
    },
    checkoutIsInsideOffice: {
      type: Boolean,
      default: false
    },
    checkout_status: {
      type: String,
      enum: ['Absent', 'Early Leave', 'Outside Zone', 'On Time','Late'], // Ajout de 'Absent' et 'On Time'
      default: 'Absent'
    },
    checkin_status: {
      type: String,
      enum: ['Present', 'Late', 'Outside Zone', 'Absent'], // Correction de 'Late ' => 'Late'
      default: 'Present'
    }
  }, {
    timestamps: true
  });
  
const Attendance = mongoose.model('Attendance', AttendanceSchema);
module.exports = Attendance;
