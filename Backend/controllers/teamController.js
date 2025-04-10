const {Team, TeamSchema } = require("../models/team");
const {Departement}= require("../models/departement")
const {User}= require("../models/user")
const nodemailer = require("nodemailer");

exports.addTeam= async (req,res)=>{
    const {code, name, departement} = req.body
    if(await Team.findOne({code:code})){
        return res.status(405).json("Team with same code already exists")
    }
    if(await Team.findOne({name:name})){
        return res.status(405).json("Team with same name already exists")
    }
    else{
        const newTeam = new Team({
            code: code,
            name: name,
            departement: departement
        })
        Team.create(newTeam)
        .then((team)=>{
            Departement.findByIdAndUpdate(departement, { $push: { teams: team._id } }, 
                { new: true })
                .then((team)=>{
                      return res.status(201).json(team)
                }).catch((err)=>{
                  return res.status(400).json({error: err})

                })
    
        }).catch((err)=>{
            return res.status(400).json({message: 'Cannot create Team',
                                         error: err
                                        })
        })
    }
}


exports.getTeamById = async (req, res) => {
    const {id}= req.params
    try {      
        const team = await Team.findById(id);  
        res.status(200).json(team);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTeamsByDepartement = async (req, res) => {
    const {id}= req.params

    try {      
        const departement = await Departement.findById(id); 
        const teams = await Team.find({ _id: { $in: departement.teams } })

        res.status(200).json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.AssignEmployeeToTeam = async (req, res) => {
    const { idTeam, idEmployee } = req.params;
  
    try {
      // Find the team by its ID
      const team = await Team.findById(idTeam);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
  
      // Find the employee by their ID
      const employee = await User.findById(idEmployee);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // 1. Check if employee is already in ANY other team
      const otherTeam = await Team.findOne({
        _id: { $ne: idTeam }, // Exclude the current team
        teamMembers: employee._id // Check if employee is in the teamMembers of any other team
      });
  
      if (otherTeam) {
        return res.status(400).json({ message: 'Employee already in another team' });
      }
  
      // 2. Check if employee is already in the current team
      if (team.teamMembers.includes(employee._id)) {
        return res.status(400).json({ message: 'Employee already in this team' });
      }
  
      // 3. Assign the employee to the current team
      const updatedTeam = await Team.findByIdAndUpdate(
        idTeam,
        { $push: { teamMembers: employee._id } }, // Add employee to the team
        { new: true } // Return the updated team object
      );
  
      return res.status(201).json(updatedTeam); // Return the updated team with the new member
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  };
  

exports.AssignHeadTeamToTeam = async (req, res) => {
    const {idTeam, idEmployee} = req.params
    try {
        const team = await Team.findById(idTeam);

        if (team) {
                const employee = await User.findById(idEmployee)
                if(employee){
                    if(team.teamMembers.includes(employee._id)){
                        Team.findByIdAndUpdate(idTeam, 
                            {headTeam: idEmployee }, 
                            { new: true })
                            .then((team)=>{
                                  return res.status(201).json(team)
                            }).catch((err)=>{
                              return res.status(400).json({error: err})

                            })
                        
                        
                    }else{
                        return res.status(400).json("Employee must belongs to this Team")
                    }
                    
                }
                else{
                    return res.status(400).json("Employee not found")
    
                }

        }else{
            return res.status(404).json({ message: 'Team not found' });

        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.detachEmployeeFromTeam = async (req, res)=>{
    const {idTeam, idEmployee} = req.params
    try {
        const team = await Team.findById(idTeam);
        if (team) {
                const employee = await User.findById(idEmployee)
                if(employee){
                    if(team.headTeam!==null && team.headTeam.equals(employee._id)){
                       await Team.findByIdAndUpdate(idTeam, {headTeam: null}, {new: true})
                    }
                    if(team.teamMembers.includes(employee._id)){                        
                            Team.findByIdAndUpdate(idTeam, 
                                                          { $pull: { teamMembers: employee._id }  }, 
                                                          { new: true })
                                                          .then((team)=>{
                                                            User.findByIdAndUpdate(employee._id, {team: null}, {new: true})
                                                                return res.status(201).json(team)
                                                          }).catch((err)=>{
                                                            return res.status(400).json({error: err})
                                                          })
                        
                        
                    }else{
                        return res.status(400).json("Employee must belongs to this team")
                    }
                    
                }
                else{
                    return res.status(400).json("Employee not found")
    
                }

        }else{
            return res.status(404).json({ message: 'Team not found' });

        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

exports.getEmployeesByTeam = async (req, res) => {
    const { id } = req.params;
    const team = await Team.findById(id);
    if(!team){
        return res.status(404).json("team not found")
    }
    try {   
        const employees = await User.find({ _id: { $in: team.teamMembers } })     
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.update= async (req,res)=>{
  const { id } = req.params;
  const {code, name} = req.body
  const team = await Team.findById(id);
  if(!team){
    return res.status(404).json("team not found")
  }
  if(team.name === name && team.code=== code){
    return res.status(405).json("Nothing to change")
  }
  if(await Team.findOne({$and: [
                                    {code:code},
                                    { _id: { $ne: team._id } }
                                ]}) ){
      return res.status(405).json("Another Team with same code already exists")
  }
  if(await Team.findOne({$and: [
                                        {name:name},
                                        { _id: { $ne: team._id } }
                                    ]})){
      return res.status(405).json("Another departement with same name already exists")
  }
  else{
      
      Team.findByIdAndUpdate(id, {code : code, name: name}, {new: true})
      .then((team)=>{
          return res.status(201).json(team)
  
      }).catch((err)=>{
          return res.status(400).json({message: 'Cannot create team',
                                       error: err
                                      })
      })
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    await Departement.findByIdAndUpdate(team.departement,  { $pull: { teams: team._id }  }, 
        { new: true });
        await Team.findByIdAndDelete(id);
    

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }


    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
