const User = require('../models/user');

exports.getEmployees = async (req, res) => {
    try {
    
        const employees = await User.find({ role: 'employees' }, 'name email role');
        
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getEmployees = async (req, res) => {
    try {
    
        const employees = await User.find({ role: 'employees' }, 'name email role');
        
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getUsers = async (req, res) => {
    try {
    
        const users = await User.find({  }, );
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRHMembers = async (req, res) => {
    try {
        const rhMembers = await User.find({ role: 'RH member' }, 'name email role');
        res.status(200).json({ rhMembers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


