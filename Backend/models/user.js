const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: ['RH member','employees','super admin','admin'] },
});


module.exports = mongoose.model('User', userSchema);
