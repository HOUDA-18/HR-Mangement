const {Departement, DepartementSchema} = require("../models/departement");
const {User}= require("../models/user")
const nodemailer = require("nodemailer");
const Roles = require("../models/rolesEnum");
const {HRskills}= require('../models/Enums')
const { Team } = require("../models/team");
const { Conversation } = require("../models/conversation");

exports.addDepartement= async (req,res)=>{
    const {code, name} = req.body
    if(await Departement.findOne({code:code})){
        return res.status(405).json("Departement with same code already exists")
    }
    if(await Departement.findOne({name:name})){
        return res.status(405).json("Departement with same name already exists")
    }
    else{
        if(name==="HR"){
            const newDepartement = new Departement({
                code: code,
                name: name,
                skills: HRskills

            })
            Departement.create(newDepartement).then((departement)=>{
                return res.status(201).json(departement)
        
            }).catch((err)=>{
                return res.status(400).json({message: 'Cannot create departement',
                                             error: err
                                            })
            })
        }
        else{
            const newDepartement = new Departement({
                code: code,
                name: name
            })
            Departement.create(newDepartement).then((departement)=>{
                return res.status(201).json(departement)
        
            }).catch((err)=>{
                return res.status(400).json({message: 'Cannot create departement',
                                             error: err
                                            })
            })
        }

    }
}


exports.getDepartementById = async (req, res) => {
    const {id}= req.params
    try {      
        const departement = await Departement.findById(id);  
        res.status(200).json(departement);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDepartements = async (req, res) => {
    try {      
        const departements = await Departement.find();  
        res.status(200).json(departements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDepartementsCount = async (req, res) => {
    try {
    
      const totalDepartements = await Departement.countDocuments();      
        res.status(200).json(totalDepartements);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  };

exports.AssignEmployeeToDepartement = async (req, res) => {
    const {idDepartement, idEmployee} = req.params
    try {
        const departement = await Departement.findById(idDepartement);

        if (departement) {
            const employee = await User.findById(idEmployee)
            if(employee){
                if(!departement.employees.includes(employee._id)){

                    if(departement.name==="HR"){
                        await User.findByIdAndUpdate(idEmployee, {departement: departement._id, role:Roles.MEMBRE_HR}, {new : true})
                        const hrAdmin = await  User.findOne({role: Roles.ADMIN_HR})
                        if(await Conversation.findOneAndUpdate({$and:[ {name: "private chat"},{chatParticipants:{ $in: [idEmployee]} } ]}, {archived: false}, {new: true})){}
                        else{  
                            const newConversation = new Conversation({
                                    name: "private chat",
                                    lastMessage: null,
                                    time:null,
                                    unread: 0,
                                    chatParticipants: [idEmployee, hrAdmin._id]
                                })
                                await Conversation.create(newConversation)
                        }
                        await Conversation.findOneAndUpdate({name: "HR Team"}, {$push: {chatParticipants: idEmployee}}, {new: true})

                    }else{
                        await User.findByIdAndUpdate(idEmployee, {departement: departement._id}, {new : true})
                    }
                    Departement.findByIdAndUpdate(idDepartement, 
                                                  { $push: { employees: idEmployee } }, 
                                                  { new: true })
                                                  .then((departement)=>{
                                                        return res.status(201).json(departement)
                                                  }).catch((err)=>{
                                                    return res.status(400).json({error: err})
    
                                                  })
                }else{
                    return res.status(400).json("Already in this departement")
                }
            }
            else{
                return res.status(400).json("Employee not found")

            }
        }else{
            return res.status(404).json({ message: 'Departement not found' });

        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.AssignChefDepartementToDepartement = async (req, res) => {
    const {idDepartement, idEmployee} = req.params
    try {
        const departement = await Departement.findById(idDepartement);

        if (departement) {
                const employee = await User.findById(idEmployee)
                if(employee){
                    if(employee.departement.equals(departement._id)){
                        const headDepartement= await User.findOne({$or: [{$and:[{departement: idDepartement, role:Roles.HEAD_DEPARTEMENT}]}, {$and:[{departement: idDepartement, role:Roles.ADMIN_HR}]}]})
                        if(headDepartement){
                            if(departement.name ==="HR"){
                                await User.findByIdAndUpdate(headDepartement._id,{role:Roles.MEMBRE_HR},{new:true});

                            }else{
                                await User.findByIdAndUpdate(headDepartement._id,{role:Roles.EMPLOYEE},{new:true});
                            }
                        }
                        if(departement.name ==="HR"){
                            await User.findByIdAndUpdate(idEmployee, {role:Roles.ADMIN_HR}, {new : true})

                        }
                        else{
                            await User.findByIdAndUpdate(idEmployee, {role:Roles.HEAD_DEPARTEMENT}, {new : true})

                        }
                        
                            Departement.findByIdAndUpdate(idDepartement, 
                                                          { chefDepartement: idEmployee }, 
                                                          { new: true })
                                                          .then((departement)=>{
                                                                return res.status(201).json(departement)
                                                          }).catch((err)=>{
                                                            return res.status(400).json({error: err})
                                                          })
                        
                        
                    }else{
                        return res.status(400).json("Employee must belongs to this departement")
                    }
                    
                }
                else{
                    return res.status(400).json("Employee not found")
    
                }

        }else{
            return res.status(404).json({ message: 'Departement not found' });

        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.detachEmployeeFromDepartement = async (req, res)=>{
    const {idDepartement, idEmployee} = req.params
    try {
        const departement = await Departement.findById(idDepartement);
        console.log(departement)
        if (departement) {
                const employee = await User.findById(idEmployee)
                if(employee){
                    if(employee.departement.equals(departement._id)){
                            const updatedEmployee = await User.findByIdAndUpdate(idEmployee, {departement:null, role:Roles.EMPLOYEE}, {new : true})
                            await Team.updateMany(
                                {
                                  departement: idDepartement
                                },
                                {
                                  $pull: { teamMembers: updatedEmployee._id }
                                }
                              );
                              if(departement.name=="HR")
                              await Conversation.findOneAndUpdate({$and:[ {name: "private chat"},{chatParticipants:{ $in: [updatedEmployee._id]} } ]}, {archived: true}, {new: true})
                            Departement.findByIdAndUpdate(idDepartement, 
                                                          { $pull: { employees: updatedEmployee._id }  }, 
                                                          { new: true })
                                                          .then((departement)=>{
                                                                return res.status(201).json(departement)
                                                          }).catch((err)=>{
                                                            return res.status(400).json({error: err})
                                                          })
                        
                        
                    }else{
                        return res.status(400).json("Employee must belongs to this departement")
                    }
                    
                }
                else{
                    return res.status(400).json("Employee not found")
    
                }

        }else{
            return res.status(404).json({ message: 'Departement not found' });

        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
/* 
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
              email: user.email.trim(),
              matricule: user.matricule.trim(),
              password: (await bcrypt.hash(user.password, 10)).toString(), // Store the hashed password
              active: false,
              role: roles.EMPLOYEE
            });
         }
      }

      if(usersToInsert.length >0){
        await User.insertMany(usersToInsert);
        res.json({ message: "Users imported successfully",
                   users: usersToInsert });
      }else{
        res.json({ message: "Nothing to import" });

      }

}
 */

exports.getEmployeesByDepartement = async (req, res) => {
    const { id } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'ALL';

    try {       
        const departement = await Departement.findById(id);
        if(!departement){
            return res.status(404).json("Departement not found")
        }
        const query = { departement: id };
    
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


exports.update= async (req,res)=>{
  const { id } = req.params;
  const {code, name} = req.body
  const departement = await Departement.findById(id);
  if(!departement){
    return res.status(404).json("Departement not found")
  }
  if(departement.name === name && departement.code=== code){
    return res.status(405).json("Nothing to change")
  }
  if(await Departement.findOne({$and: [
                                    {code:code},
                                    { _id: { $ne: departement._id } }
                                ]}) ){
      return res.status(405).json("Another departement with same code already exists")
  }
  if(await Departement.findOne({$and: [
                                        {name:name},
                                        { _id: { $ne: departement._id } }
                                    ]})){
      return res.status(405).json("Another departement with same name already exists")
  }
  else{
      
      Departement.findByIdAndUpdate(id, {code : code, name: name}, {new: true})
      .then((departement)=>{
          return res.status(201).json(departement)
  
      }).catch((err)=>{
          return res.status(400).json({message: 'Cannot create departement',
                                       error: err
                                      })
      })
  }
};

exports.deleteDepartement = async (req, res) => {
  try {
    const { id } = req.params;
    await User.updateMany({ departement: id }, { $set: { departement: null } });
    await Team.deleteMany({departement:id});
    const departement = await Departement.findByIdAndDelete(id);

    if (!departement) {
      return res.status(404).json({ message: 'Departement not found' });
    }

    res.status(200).json({ message: 'Departement deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
