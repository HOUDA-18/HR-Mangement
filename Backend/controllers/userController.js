const {User, UserSchema} = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {Status, Roles, employmentType} = require('../models/Enums')
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Joi = require("joi");
const { Departement } = require("../models/departement");
require("dotenv").config();



exports.login= async (req,res)=>{
    const {matricule, password} = req.body
    const user = await User.findOne({matricule:matricule})
    if (user == null) {
        return res.status(400).json('Cannot find user')
    }
    try {
        const id = user.id;
        if(user.status==Status.Suspended){
          res.status(200).json({
            message: "Your account is suspended"
          }
          )
        }
        bcrypt.compare(password, user.password, async (err, ress)=>{
        const token= jwt.sign({id}, process.env.JWT_SECRET)
         if(ress ) {
            if(user.status==Status.Inactive){
                    await User.findOneAndUpdate({matricule: matricule}, {status: Status.Active})
            }
            
          
            res.status(200).json({user: user,
                  token: token
                })
            }
            else{
                res.status(405).json({message: "Verify credentials"}) 
            }
        }) 
            
       
    } catch (err){
        res.status(500).json({error: err})
    }
}

exports.register= async (req,res)=>{

    const { firstname, lastname, matricule, email,phone,  password, employmentType} = req.body
    const u = new User({
        firstname: firstname,
        lastname: lastname,
        matricule: matricule,
        email: email,
        phone: phone || "",
        password: (await bcrypt.hash(password, 10)).toString(),
        status: Status.Inactive,
        role: Roles.EMPLOYEE,
        employmentType : employmentType,
        createdAt: (new Date()).toDateString(),
        updatedAt :(new Date()).toDateString()
    })

    if(await User.findOne({matricule: matricule})){
        return res.status(405).json("matricule already exists")
    }
    if(await User.findOne({email: email})){
        return res.status(405).json("email already exists")
    }
    else{
        User.create(u).then((user)=>{
            return res.status(201).json( user)
    
        }).catch((err)=>{
            return res.status(400).json('Cannot create user')
        })
    }

}

exports.import= async (req,res)=>{

    //const { firstname, lastname, matricule, email, password} = req.body
    const users= req.body
    const usersToInsert=[]
    

    if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      for (let user of users) {     

         const existingUser = await User.findOne({ 
            $or: [{ email: user.email }, { matricule: user.matricule }]
          });
        if (!existingUser) { 
    
            usersToInsert.push({
              firstname: user.firstname.trim(),
              lastname: user.lastname.trim(),
              phone: user.phone.trim(),
              email: user.email.trim(),
              matricule: user.matricule.trim(),
              password: (await bcrypt.hash(user.password, 10)).toString(), // Store the hashed password
              status: Status.Inactive,
              role: Roles.EMPLOYEE,
              employmentType: user.employmentType,
              createdAt: (new Date()).toDateString(),
              updatedAt :(new Date()).toDateString()
              
            });
         }
      }

      if(usersToInsert.length >0){
        await User.insertMany(usersToInsert);
        res.json({ message: "Users imported successfully" });
      }else{
        res.json({ message: "Nothing to import" });

      }

}





    exports.forgetPassword = async (req, res) => {

        try {
            const { email } = req.body;
        
            if (!email) {
              return res.status(400).send({ message: "Please provide email" });
            }
        
            const checkUser = await User.findOne({ email });
        
            if (!checkUser) {
              return res
                .status(400)
                .send({ message: "User not found please register" });
            }
        
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
        
            const transporter = nodemailer.createTransport({
              service: "gmail",
              secure: true,
              auth: {
                user: process.env.MY_GMAIL,
                pass: process.env.MY_PASSWORD,
              },
            });
        
            const receiver = {
              from: "webdesignwalah@gmail.com",
              to: email,
              subject: "Password Reset Request",
              html: `<html>
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Email Notification</title>
                  <style>
                      body {
                          font-family: Arial, sans-serif;
                          background-color: #f4f4f4;
                          margin: 0;
                          padding: 0;
                      }
                      .container {
                          max-width: 600px;
                          margin: 20px auto;
                          background: #ffffff;
                          padding: 20px;
                          border-radius: 8px;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                          text-align: center;
                      }
                      .btn {
                          display: inline-block;
                          background-color: #007bff;
                          color: white;
                          padding: 12px 20px;
                          text-decoration: none;
                          font-size: 16px;
                          border-radius: 5px;
                          margin-top: 20px;
                      }
                      .btn:hover {
                          background-color: #0056b3;
                      }
                      .footer {
                          margin-top: 20px;
                          font-size: 12px;
                          color: #888;
                      }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h2>Hello,</h2>
                      <p>You have a new notification. Click the button below to set your new password.</p>
                      
                      <a href="${process.env.CLIENT_URL}/${token}" class="btn">Reset Password</a>
              
                      <p class="footer">If you did not request this email, please ignore it.</p>
                  </div>
              </body>
              </html>`,
            };
        
            await transporter.sendMail(receiver);
        
            return res.status(200).send({
              message: "Password reset link send successfully on your gmail account",
            });
          } catch (error) {
            return res.status(500).send({ message: "Something went wrong" });
          }
    };

    exports.resetPassword = async (req, res) => {
        try {
          const { token } = req.params;
          const { password } = req.body;
      
          if (!password) {
            return res.status(400).send({ message: "Please provide password" });
          }
      
          const decode = jwt.verify(token, process.env.JWT_SECRET);
      
          const user = await User.findOne({ email: decode.email });
      
          const newhashPassword = await hashPassword(password);
      
          user.password = newhashPassword;
          await user.save();
      
          return res.status(200).send({ message: "Password reset successfully" });
        } catch (error) {
          return res.status(500).send({ message: error });
        }
      };
      const hashPassword = async (userPassword) => {
        const saltRound = 10;
        return await bcrypt.hash(userPassword, saltRound);
      };



      exports.changePassword = async (req, res) => {
        try {
          const { email, currentPassword, newPassword } = req.body;
      
          if (!email || !currentPassword || !newPassword) {
            return res
              .status(400)
              .send({ message: "Please provide all required fields" });
          }
      
          const checkUser = await User.findOne({ email });
      
          if (!checkUser) {
            return res
              .status(400)
              .send({ message: "User not found please register" });
          }
      
          const isMatchPassword = await comparePassword(
            currentPassword,
            checkUser.password
          );
      
          if (!isMatchPassword) {
            return res
              .status(400)
              .send({ message: "Current password does not match" });
          }
      
          const newHashPassword = await hashPassword(newPassword);
      
          await User.updateOne({ email }, { password: newHashPassword });
      
          return res.status(200).send({ message: "Password change successfully" });
        } catch (error) {
          return res.status(500).send({ message: "Something went wrong" });
        }
      };

      const comparePassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
      };

exports.getEmployees = async (req, res) => {

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const departement = req.query.departement || 'ALL';
  const status = req.query.status || 'ALL';
    try {

            // Build the query dynamically
    const query = { role: 'EMPLOYEE' };

    if (departement !== 'ALL') {
      query.departement = departement === 'Empty' ? null : departement;
    }

    if (status !== 'ALL') {
      query.status = status;
    }

    const projection = 'firstname lastname email matricule role status employmentType phone departement image';

    const employees = await User.find(query, projection)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await User.countDocuments(query);
        res.status(200).json({
          employees: employees,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
    
        const users = await User.find({  },  'firstname lastname email role matricule status phone departement createdAt');
        
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUsersCount = async (req, res) => {
  try {
  
    const totalUsers = await User.countDocuments();      
      res.status(200).json(totalUsers);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.getUserByID = async (req, res) => {
  const { id } = req.params;
  try {
  
      const user = await User.findById(id,  'firstname lastname email role matricule status phone departement createdAt image');
      
      res.status(200).json(user);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
};

exports.getRHMembers = async (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
    try {
        const rhMembers = await User.find({$or:[{role: 'MEMBRE_HR'},{role: "ADMIN_HR"}]  }, 'firstname lastname email role status phone departement matricule')
        .skip((page - 1) * limit)
        .limit(limit);

        const totalRhMembers = await User.find({$or:[{role: 'MEMBRE_HR'},{role: "ADMIN_HR"}]  }).countDocuments();;
        res.status(200).json( {
          rhMembers: rhMembers,
          totalPages: Math.ceil(totalRhMembers / limit),
          currentPage: page,
        } );
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.update= async (req,res)=>{
  const { id } = req.params;
  const { firstname, lastname, matricule, email,phone,image} = req.body
  console.log("image: ", image)
  try {
      const updatedProfile = await User.findByIdAndUpdate(id,
        { firstname: firstname, lastname: lastname, matricule: matricule, email: email,phone: phone,image: image },
        { new: true}
      );
  
      if (!updatedProfile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', data: updatedProfile });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ message: 'Error updating profile', error: err });
    }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndUpdate(id, {status: Status.Suspended});

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      from: "webdesignwalah@gmail.com",
      to: deletedUser.email,
      subject: "Account Suspension",
      html: `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Suspension</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              h2 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  color: #555;
              }
              .code {
                  font-size: 24px;
                  font-weight: bold;
                  background-color: #f8f8f8;
                  padding: 10px;
                  display: inline-block;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .btn {
                  display: inline-block;
                  background-color: #28a745;
                  color: white;
                  padding: 12px 20px;
                  text-decoration: none;
                  font-size: 16px;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .btn:hover {
                  background-color: #218838;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Account Suspension</h2>
              <p>We are sorry to inform you that your account was suspended</p>
              </div>
</body>
</html>`,
    };

    await transporter.sendMail(receiver);
    res.status(200).json({ message: 'User Suspended successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendVerificationCode = async (req, res) => {

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Please provide email" });
    }

    const checkUser = await User.findOne({ email });

    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "User not found please register" });
    }
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const receiver = {
      from: "webdesignwalah@gmail.com",
      to: email,
      subject: "Verification code",
      html: `
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              h2 {
                  color: #333;
              }
              p {
                  font-size: 16px;
                  color: #555;
              }
              .code {
                  font-size: 24px;
                  font-weight: bold;
                  background-color: #f8f8f8;
                  padding: 10px;
                  display: inline-block;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .btn {
                  display: inline-block;
                  background-color: #28a745;
                  color: white;
                  padding: 12px 20px;
                  text-decoration: none;
                  font-size: 16px;
                  border-radius: 5px;
                  margin-top: 20px;
              }
              .btn:hover {
                  background-color: #218838;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2>Email Verification</h2>
              <p>Use the following verification code to complete your login:</p>
      
              <div class="code">${verificationCode}</div>
              </div>
</body>
</html>`,
    };

    await transporter.sendMail(receiver);

    return res.status(200).json({
      code:verificationCode      
    });
  } catch (error) {
    return res.status(500).send({ message: error});
  }
};

exports.userDistributionByRole =  async (req, res) => {
  try {
    // Aggregate users by role using MongoDB aggregation pipeline
    const userRoles = await User.aggregate([
      { $match: { role: { $ne: "SUPER_ADMIN" } } },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    // Format data into a structure that can be used for the pie chart
    const distribution = userRoles.map(role => ({
      name: role._id,
      value: role.count
    }));

    res.json(distribution); // Send the distribution data as response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user distribution', error: err });
  }
}

exports.StatusDistribution= async (req, res) => {
  try {
    const statusDistribution = await User.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const distribution = statusDistribution.map(role => ({
      name: role._id,
      count: role.count
    }));
    res.json(distribution);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user status distribution', error: err });
  }
}

exports.DepartementDistribution = async (req, res) => {
  try {
    const departmentDistribution = await Departement.aggregate([
      {
        $lookup: {
          from: "user",  // "users" is the collection where your user data is stored
          localField: "employees",  // Field in Department that references employees
          foreignField: "_id",  // Reference field in User model
          as: "employeeDetails",  // Join the user data into this array
        },
      },
      {
        $project: {
          department: "$name",  // Include the department name
          users: { $size: "$employeeDetails" },  // Count the number of users in the employees array
        },
      },
      {
        $project: {
          department: 1,
          users: 1,  // Return department name and user count
        },
      },
    ]);


    res.json(departmentDistribution); // Send the formatted data
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user department distribution', error: err });
  }
};