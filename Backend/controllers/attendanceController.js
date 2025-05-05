const { default: mongoose } = require('mongoose');
const Attendance = require('../models/attendance');
const { User } = require('../models/user');

const OFFICE_LAT = 36.89991686807514;
const OFFICE_LNG = 10.18526209017441;
const MAX_DISTANCE_KM = 0.2;

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ✅ Check-In
exports.getLocation = async (req, res) => {
  try {
    const { latitude, longitude, timestamp, employeeId } = req.body;
    if (!latitude || !longitude || !timestamp || !employeeId) {
      return res.status(400).json({ success: false, message: 'Missing required data' });
    }

    const date = new Date(timestamp).toDateString();
    const existing = await Attendance.findOne({ employeeId, date });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: '🕒 You have already checked in today.',
        attendance: existing
      });
    }

    const distance = getDistanceFromLatLonInKm(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
    const insideOffice = distance <= MAX_DISTANCE_KM;
    const checkInTime = new Date(timestamp);
    const deadline = new Date(checkInTime);
    deadline.setHours(9, 0, 0, 0);

    const isLate = checkInTime > deadline;

    const attendance = new Attendance({
      employeeId,
      date,
      checkInTime,
      latitude,
      longitude,
      distanceFromOffice: distance,
      checkinIsInsideOffice: insideOffice,
      checkin_status: insideOffice
        ? (isLate ? 'Late' : 'Present')
        : 'Outside Zone',
      checkout_status: 'Absent' // Default status if no checkout
    });

    await attendance.save();

    return res.status(200).json({
      success: true,
      checkinIsInsideOffice: insideOffice,
      message: insideOffice
        ? (isLate ? '✅ Check-in successful, but you are late.' : '✅ Check-in successful, you are in the office.')
        : '⚠️ Check-in registered, but you are outside the allowed area.',
      distance: distance.toFixed(3) + ' km',
      attendance
    });
  } catch (error) {
    console.error('Error in getLocation:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ✅ Check-Out
exports.checkOut = async (req, res) => {
  try {
    const { employeeId, timestamp, latitude, longitude } = req.body;
    if (!employeeId || !timestamp || !latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Missing required data' });
    }

    const date = new Date(timestamp).toDateString();
    const attendance = await Attendance.findOne({ employeeId, date });

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'No check-in record found for today.' });
    }

    if (attendance.checkOutTime) {
      return res.status(200).json({
        success: true,
        message: '🕒 You have already checked out today.',
        attendance
      });
    }

    const distance = getDistanceFromLatLonInKm(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
    const insideOffice = distance <= MAX_DISTANCE_KM;
    const checkOutTime = new Date(timestamp);
    const minCheckoutTime = new Date(checkOutTime);
    minCheckoutTime.setHours(17, 0, 0, 0);

    const lateThreshold = new Date(checkOutTime);
    lateThreshold.setHours(18, 0, 0, 0);

    const earlyLeave = checkOutTime < minCheckoutTime;
    const isLate = checkOutTime > lateThreshold;

    attendance.checkOutTime = checkOutTime;
    attendance.checkoutIsInsideOffice = insideOffice;
    attendance.checkout_status = !insideOffice
      ? 'Outside Zone'
      : earlyLeave
      ? 'Early Leave'
      : isLate
      ? 'Late'
      : 'On Time';

    await attendance.save();

    return res.status(200).json({
      success: true,
      checkoutIsInsideOffice: insideOffice,
      message: !insideOffice
        ? '⚠️ Checked out from outside the allowed zone.'
        : earlyLeave
        ? 'Checked out early!'
        : isLate
        ? 'Checked out late.'
        : 'Checked out successfully.',
      distance: distance.toFixed(3) + ' km',
      attendance
    });
  } catch (error) {
    console.error('Error in checkOut:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ✅ Get attendance for a user
exports.getUserAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    const records = await Attendance.find({ employeeId: user._id }).populate('employeeId');

    const attendanceData = records.map(record => ({
      date: record.date,
      checkIn: record.checkInTime || null,
      checkOut: record.checkOutTime || null,
      checkin_status: record.checkin_status,
      checkout_status: record.checkout_status,
      checkinIsInsideOffice: record.checkinIsInsideOffice,
      checkoutIsInsideOffice: record.checkoutIsInsideOffice
    }));

    res.status(200).json({ success: true, attendance: attendanceData });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ success: false, message: 'Server error fetching attendance.' });
  }
};

// ✅ Get today's attendance
exports.getTodayAttendance = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('employeeId', '_id firstname lastname image')
      .exec();

    const result = todayAttendance.map((att) => ({
      employeeId: att.employeeId._id,
      firstname: att.employeeId.firstname,
      lastname: att.employeeId.lastname,
      photo: att.employeeId.image,
      checkInStatus: att.checkin_status,
      checkOutStatus: att.checkout_status,
      checkInTime: att.checkInTime,
      checkOutTime: att.checkOutTime,
      distanceFromOffice: att.distanceFromOffice,
      checkinIsInsideOffice: att.checkinIsInsideOffice,
      checkoutIsInsideOffice: att.checkoutIsInsideOffice,
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching today attendance:', err);
    res.status(500).json({ message: 'Server error while fetching attendance' });
  }
};
