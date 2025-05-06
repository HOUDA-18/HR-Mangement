const express = require('express');
const router = express.Router();
const { Conges, CongesSchema } = require('../models/conges'); // Fix schema name capitalization
const validate = require('../middelwares/validate');
const { User } = require('../models/user');
const transporter = require('../config/email');

// POST - Create new leave request
router.post('/', validate(CongesSchema), async (req, res) => {
    try {
        // Check if employee exists
        const employee = await User.findById(req.body.id_employee);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const newLeave = new Conges(req.body);
        await newLeave.save();
        res.status(201).json(newLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Get all leave requests (filterable by employee ID and status)
router.get('/', async (req, res) => {
    try {
        const filters = {};
        if (req.query.id_employee) filters.id_employee = req.query.id_employee;
        if (req.query.status) filters.status = req.query.status;

        const leaves = await Conges.find(filters);
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Get single leave request by ID
router.get('/:id', async (req, res) => {
    try {
        const leave = await Conges.findById(req.params.id);
        if (!leave) return res.status(404).json({ message: 'Leave request not found' });
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - Update leave request details
router.put('/:id', validate(CongesSchema), async (req, res) => {
    try {
        // Prevent changing employee ID after creation
        delete req.body.id_employee;

        const updatedLeave = await Conges.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!updatedLeave) return res.status(404).json({ message: 'Leave request not found' });
        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - Update leave request status with email notification
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        if (!['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Update the leave request
        const updatedLeave = await Conges.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedLeave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Find the employee's email
        const employee = await User.findById(updatedLeave.id_employee);
        if (!employee || !employee.email) {
            return res.status(404).json({ message: 'Employee email not found' });
        }

        // Send email notification
        const mailOptions = {
            from: "Hr Departement",
            to: employee.email,
            subject: `Leave Request ${status}`,
            html: `
                <h2>Your Leave Request Has Been ${status.toUpperCase()}</h2>
                <p>Details of your request:</p>
                <ul>
                    <li>Type: ${updatedLeave.type}</li>
                    <li>Start Date: ${new Date(updatedLeave.startDate).toDateString()}</li>
                    <li>End Date: ${new Date(updatedLeave.endDate).toDateString()}</li>
                    <li>Reason: ${updatedLeave.reason}</li>
                    <li>Status: <strong>${status}</strong></li>
                </ul>
                <p>Submitted on: ${new Date(updatedLeave.date_soumission).toDateString()}</p>
            `
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email sending failed:', error);
            } else {
                console.log('Email sent:', info.messageId);
            }
        });

        res.json(updatedLeave);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: error.message });
    }
});

// DELETE - Delete leave request
router.delete('/:id', async (req, res) => {
    try {
        const deletedLeave = await Conges.findByIdAndDelete(req.params.id);
        if (!deletedLeave) return res.status(404).json({ message: 'Leave request not found' });
        res.json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;