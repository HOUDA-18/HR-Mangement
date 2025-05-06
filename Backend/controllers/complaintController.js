const Complaint = require("../models/Complaint");
const nodemailer = require("nodemailer");
const { User } = require("../models/user");

// Créer une nouvelle plainte
exports.createComplaint = async (req, res) => {
  const infoUser = req.body.infoUser;
  try {
    const complaint = new Complaint({
      //userId: req.user._id, // Supposant que l'utilisateur est authentifié
      userId: req.body.userId,
      subject: req.body.subject,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
    });

    await complaint.save();
    receiverEmail(complaint, infoUser);
    res.status(201).json({ message: "Complaint created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les plaintes
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate({
        path: "userId",
        select: "-password",
        options: { strictPopulate: false },
        populate: {
          path: "departement",
          model: "departement",
        },
      })
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une plainte par ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une plainte
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    const emailReceiver = await User.findOne({ _id: complaint.userId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Mise à jour des champs autorisés
    if (req.body.subject) complaint.subject = req.body.subject;
    if (req.body.description) complaint.description = req.body.description;
    if (req.body.category) complaint.category = req.body.category;
    if (req.body.priority) complaint.priority = req.body.priority;
    if (req.body.response) complaint.response = req.body.response;

    if (req.body.status) {
      complaint.status = req.body.status;
      await sendEmailStatus(emailReceiver.email, complaint);
    }

    await complaint.save();
    res.json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une plainte
exports.deleteComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;

    // Vérifier si l'ID est valide
    if (!complaintId) {
      return res.status(400).json({ message: "Complaint ID is required" });
    }
    console.log("complaintId: ", complaintId);
    const complaint = await Complaint.findByIdAndDelete(complaintId);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res
      .status(500)
      .json({ message: "Error deleting complaint", error: error.message });
  }
};
const receiverEmail = async (complaint, infoUser) => {
  try {
    if (infoUser.role === "HEAD_DEPARTEMENT" || infoUser.role === "ADMIN_HR") {
      const emailSuperAdmin = await User.findOne({ role: "SUPER_ADMIN" });
      await sendEmail(emailSuperAdmin.email, complaint);
    } else if (infoUser.role === "EMPLOYEE") {
      const emailHeadDepartement = await User.findOne({
        _id: infoUser.departement.chefDepartement,
      });
      await sendEmail(emailHeadDepartement.email, complaint);
    }

    // Envoyer un email à l'utilisateur actuel
    // if (infoUser.email) {
    //   console.log("infoUser: ", infoUser.email); // Envoie l'email de l'utilisateur actuel
    //   await sendEmail(infoUser.email);
    // }
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};
const sendEmail = async (email, complaint) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const receiver = {
      from: process.env.MY_GMAIL,
      to: email,
      subject: complaint.subject,
      html: complaint.description,
    };
    await transporter.sendMail(receiver);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};
const sendEmailStatus = async (receiverEmail, complaint) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });
    const receiver = {
      from: process.env.MY_GMAIL,
      to: receiverEmail,
      subject: "Update Status Complaint",
      html:
        "The status of your complaint has been updated to " +
        "<strong>" +
        complaint.status +
        "</strong>",
    };
    await transporter.sendMail(receiver);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};
