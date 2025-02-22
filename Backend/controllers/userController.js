const User = require('../models/user');

exports.getEmployees = async (req, res) => {
    try {
    
        const employees = await User.find({ role: 'EMPLOYEE' }, ' firstname lastname mail ');
        
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
    
        const users = await User.find({  },  'firstname lastname mail role  statut');
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRHMembers = async (req, res) => {
    try {
        const rhMembers = await User.find({ role: 'MEMBRE_HR' }, 'firstname lastname mail');
        res.status(200).json({ rhMembers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


