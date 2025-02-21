const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    speciality: { type: String, required: true, enum: ['Developpeur','Commercial','Finance','Marketing'] },
});


module.exports = mongoose.model('User', userSchema);
