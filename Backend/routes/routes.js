
module.exports= app =>{
    const userController= require("../controllers/userController")
    const departementController = require("../controllers/departementController")
    const teamController = require("../controllers/teamController")
    const offerController = require("../controllers/offreController")
    const candidatureController= require("../controllers/CandidatureController")
    const meetingController = require("../controllers/meetingController")
    const conversationController = require('../controllers/conversationController')
    const attendanceController=require("../controllers/attendanceController")
    const notificationController=require("../controllers/notificationController")

    const { UserSchema, loginSchema} = require("../models/user");
    const {DepartementSchema}=require("../models/departement")
    const {TeamSchema}= require("../models/team")
    const {offerSchema}= require("../models/offre")
    const {candidatureSchema} = require('../models/candidature')
    const validate = require('../middelwares/validate')
    var router = require("express").Router();
    const multer = require('multer');
    const upload = multer({ storage: multer.memoryStorage() });

    const express = require('express');


    // face recognition routes
    router.post("/signupface", upload.single("imageData"), userController.signupface);
    router.post("/loginface", userController.loginface);
    //get all users
    router.get('/employees', userController.getEmployees);
    router.get('/users', userController.getUsers);
    router.get('/HRmembers',userController.getRHMembers)

  //create a new user
    router.post("/users/register",upload.single("image") ,validate(UserSchema), userController.register);

    router.post("/users/import", userController.import);

    router.post('/users/login', validate(loginSchema), userController.login);

    router.get('/users/getById/:id', userController.getUserByID);

    //update user
    router.post("/users/update/:id", userController.update);
    router.post("/users/simpleupdate/:id", userController.simpleUpdate);
    //delete user
    router.delete('/users/delete/:id', userController.deleteUser);

    //reset password
    router.post('/users/forget-password', userController.forgetPassword);

    router.post('/users/reset-password/:token', userController.resetPassword);

    router.post('/users/change-password', userController.changePassword);

    router.get('/users/totalUsers', userController.getUsersCount)

    router.get('/user-distribution',userController.userDistributionByRole);
    router.get('/user-status-distribution', userController.StatusDistribution);
    router.get('/user-department-distribution', userController.DepartementDistribution);
    router.get('/simple-employees', userController.getSimpleEmployees);
    //departements management
    router.get('/departements', departementController.getDepartements)
    router.get('/departements/totalDepartements', departementController.getDepartementsCount)

    router.get('/departements/getById/:id', departementController.getDepartementById)

    router.get('/departements/:id', departementController.getEmployeesByDepartement)

    router.post('/departements',validate(DepartementSchema), departementController.addDepartement)

    router.put('/departements/:id',validate(DepartementSchema), departementController.update)

    router.delete('/departements/:id', departementController.deleteDepartement)

    router.put('/departements/assignEmployee/:idDepartement/:idEmployee', departementController.AssignEmployeeToDepartement)

    router.put('/departements/detachEmployee/:idDepartement/:idEmployee', departementController.detachEmployeeFromDepartement)

    router.post('/departements/assignChefDepartement/:idDepartement/:idEmployee', departementController.AssignChefDepartementToDepartement)


    router.post('/users/verfy-account',userController.sendVerificationCode)

    router.get('/hire', offerController.hire)


    // teams routes
    router.get('/teamsByDepartement/:id', teamController.getTeamsByDepartement)

    router.get('/employeesByTeam/:id', teamController.getEmployeesByTeam)

    router.get('/teams/:id', teamController.getTeamById)

    router.post('/addTeam',validate(TeamSchema), teamController.addTeam)

    router.put('/updateTeam/:id',validate(TeamSchema), teamController.update)

    router.delete('/deleteTeam/:id', teamController.deleteTeam)

    router.put('/teams/assignEmployee/:idTeam/:idEmployee', teamController.AssignEmployeeToTeam)

    router.put('/teams/detachEmployee/:idTeam/:idEmployee', teamController.detachEmployeeFromTeam)

    router.post('/teams/assignHeadTeam/:idTeam/:idEmployee', teamController.AssignHeadTeamToTeam)


    // offre routes
    router.post('/offre/addoffre', validate(offerSchema),offerController.addOffer )
    router.get('/offre/all',offerController.getAllOffers )
    router.get('/offre/offers',offerController.getOffers )
    router.put('/offre/:id/positions', offerController.updateNumberOfPositions);
    router.put('/offre/:id/status', offerController.updateOfferStatus);
    router.put('/offer/:id', offerController.closeOffre)

    router.get('/candidature/:id', candidatureController.getAllCandidatures );
    router.get('/candidatures/:id',candidatureController.getCandidatureById)
    router.post('/candidatures',validate(candidatureSchema), candidatureController.addCandidature)
    router.post('/candidatures/generateAIinterview/:id', candidatureController.generateAiInterview)
    router.post('/candidatures/acceptCandidature/:id', candidatureController.acceptCandidature)

    //
// Ajoutez cette ligne dans la section des routes candidature
    router.put('/candidature/update-status/:id', candidatureController.updateCandidatureStatus);

    router.get('/aiInterview/:id', candidatureController.getAIinterviewByIdCandidature)

    router.post('/candidatures/addMeeting/:id', meetingController.createMeeting)

    // Backend (Node.js/Express exemple)
    // Ajoutez cette ligne dans la section des routes candidature

    //attendance routes
    router.post('/attendance/checkin',attendanceController.getLocation);
    router.post('/attendance/checkout',attendanceController.checkOut)
    router.get('/attendance/user/:id',attendanceController.getUserAttendance)
    router.get('/attendance/today',attendanceController.getTodayAttendance)


    router.get('/conversations/:userId', conversationController.getConversations)
    router.post('/conversations', conversationController.createGroupChat)
    router.get('/conversation/:id', conversationController.getConversationById)
    router.get('/messages/:chatId', conversationController.getMessagesByConversation)
    router.post('/messages/:chatId', conversationController.saveMessage)

    router.get('/notifications/:userId', notificationController.getNotifications)

    app.use('/api', router);
  
}