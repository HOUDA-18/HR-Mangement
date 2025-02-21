const User = require('../models/employees');
const Rhmember = require('../models/rhmember');
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email speciality'); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getRHMember= async (req, res) => {
    try {
        const rhmember= await Rhmember.find({}, 'name email'); 
        res.json(rhmember);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};