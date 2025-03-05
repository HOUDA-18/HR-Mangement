
module.exports= app =>{
    const userController= require("../controllers/userController")
    const departementController = require("../controllers/departementController")
    const { UserSchema, loginSchema} = require("../models/user");
    const {DepartementSchema}=require("../models/departement")
    const validate = require('../middelwares/validate')
    var router = require("express").Router();

    //get all users
    router.get('/employees', userController.getEmployees);
    router.get('/users', userController.getUsers);
    router.get('/HRmembers',userController.getRHMembers)

  //create a new user
    router.post("/users/register",validate(UserSchema), userController.register);

    router.post("/users/import", userController.import);

    router.post('/users/login', validate(loginSchema), userController.login);

    //update user
    router.put("/users/update/:id", userController.update);

    //delete user
    router.delete('/users/delete/:id', userController.deleteUser);

    //reset password
    router.post('/users/forget-password', userController.forgetPassword);

    router.post('/users/reset-password/:token', userController.resetPassword);

    router.post('/users/change-password', userController.changePassword);

    //departements management
    router.get('/departements', departementController.getDepartements)

    router.get('/departements/getById/:id', departementController.getDepartementById)

    router.get('/departements/:id', departementController.getEmployeesByDepartement)

    router.post('/departements',validate(DepartementSchema), departementController.addDepartement)

    router.put('/departements/:id',validate(DepartementSchema), departementController.update)

    router.delete('/departements/:id', departementController.deleteDepartement)

    router.put('/departements/assignEmployee/:idDepartement/:idEmployee', departementController.AssignEmployeeToDepartement)

    router.put('/departements/detachEmployee/:idDepartement/:idEmployee', departementController.detachEmployeeFromDepartement)

    router.post('/departements/assignChefDepartement/:idDepartement/:idEmployee', departementController.AssignChefDepartementToDepartement)


    router.post('/users/verfy-account',userController.sendVerificationCode)

/* 



    router.post('/users/update/:id',verifyToken, userController.update)

    router.post('/users/delete/:id',verifyToken, userController.delete)

    router.get('/users/list',verifyToken, userController.list)

    router.get('/clients/count',verifyToken, userController.clientsCount)

    router.get('/prestataires/count',verifyToken, userController.prestatairesCount)

    router.get('/users/select/clients',verifyToken, userController.selectClient)
    
    router.get('/users/select/prestataires',verifyToken, userController.selectPrestataire)

    router.get('/users/list/:id',verifyToken, userController.show)

    router.post('/users/accept/:id',verifyToken, userController.accept)

    //catalogues
    router.post("/catalogues/new", verifyToken, catalogueController.create);

    router.post('/catalogues/findByClient',verifyToken, catalogueController.findByClient)

    router.post('/catalogues/update/:id',verifyToken, catalogueController.update)

    router.post('/catalogues/delete/:id',verifyToken, catalogueController.delete)

    router.get('/catalogues/list',verifyToken, catalogueController.list)

    router.get('/catalogues/count',verifyToken, catalogueController.count)

    router.get('/catalogues/count',verifyToken, catalogueController.list)

    router.get('/catalogues/list/:id',verifyToken, catalogueController.show)
    
    router.get('/catalogues/select',verifyToken, catalogueController.selectCatalogue)


    //services
    router.post("/services/new",verifyToken,  serviceController.create);

    router.post('/services/findByCatalogue',verifyToken,   serviceController.findByCatalogue)

    router.post('/services/update/:id',verifyToken,   serviceController.update)

    router.post('/services/delete/:id',verifyToken,   serviceController.delete)

    router.get('/services/list',verifyToken,  serviceController.list)

    router.get('/services/list/:id',verifyToken,  serviceController.show)
    
    router.get('/services/select',verifyToken, serviceController.selectService)



    //livrables
    router.post("/livrables/new",verifyToken,  livrableController.create);

    router.post('/livrables/findByService',verifyToken,   livrableController.findByService)

    router.post('/livrables/admin/update/:id',verifyToken,   livrableController.updateAdmin)
    
    router.post('/livrables/client/update/:id',verifyToken,   livrableController.updateClient)

    router.post('/livrables/prestatire/update/:id',verifyToken,   livrableController.updatePrestatire)

    router.post('/livrables/delete/:id',verifyToken,   livrableController.delete)

    router.get('/livrables/list',verifyToken,  livrableController.list)

    router.get('/livrables/count',verifyToken,  livrableController.count)

    router.get('/livrables/total',verifyToken,  livrableController.total)

    router.get('/livrables/sommeFTR',verifyToken,  livrableController.sommeFTR)

    router.get('/livrables/sommeOTD',verifyToken,  livrableController.sommeOTD)

    router.get('/livrables/count',verifyToken,  livrableController.list)

    router.get('/livrables/list/:id',verifyToken,  livrableController.show)

    router.post('/livrables/assign',verifyToken,   livrableController.assign)
    
    router.get('/livrables/select',verifyToken, livrableController.selectLivrable)

    router.get('/livrables/findByListe/:id',verifyToken,   livrableController.livrableByListe)

    router.get('/livrables/findByCatlogue/:id',verifyToken,   livrableController.livrableByCatalogue)

    router.get('/livrables/ByUser/:id',verifyToken,   livrableController.livrableByUser)



    
    //activites
    router.post("/activites/new",verifyToken,  activiteController.create);

    router.post('/activites/findByLivrable',verifyToken,   activiteController.findByLivrable)

    router.post('/activites/update/:id',verifyToken,   activiteController.update)

    router.post('/activites/delete/:id',verifyToken,   activiteController.delete)

    router.get('/activites/list',verifyToken,  activiteController.list)

    router.get('/activites/list/:id',verifyToken,  activiteController.show)

    router.post('/activites/assign',verifyToken,   activiteController.assign)

    router.post('/activites/validate',verifyToken,   activiteController.validate)

    router.post('/activites/comment/:id',verifyToken,   activiteController.comment)

    router.post('/activites/commentClient/:id',verifyToken,   activiteController.commentClient)

    router.post('/activites/count',verifyToken,  activiteController.count)

    router.get('/activites/total',verifyToken,  activiteController.total)

    router.post('/activites/sommeFTR',verifyToken,  activiteController.sommeFTR)

    router.post('/activites/sommeOTD',verifyToken,  activiteController.sommeOTD)

    router.get('/activites/totalFTR',verifyToken,  activiteController.totalFTR)

    router.get('/activites/totalOTD',verifyToken,  activiteController.totalOTD)

   //liste 
   router.post("/listes/new",verifyToken,  listeController.create);

    router.post('/listes/findByService',verifyToken,   listeController.findByService)

    router.post('/listes/admin/update/:id',verifyToken,   listeController.updateAdmin)
    
    router.post('/listes/client/update/:id',verifyToken,   listeController.updateClient)

    router.post('/listes/client/validate/:id',verifyToken,   listeController.validateClient)

    router.post('/listes/client/reject/:id',verifyToken,   listeController.rejectClient)

    router.post('/listes/prestatire/update/:id',verifyToken,   listeController.updatePrestatire)

    router.post('/listes/delete/:id',verifyToken,   listeController.delete)

    router.get('/listes/list',verifyToken,  listeController.list)

    router.get('/listes/list/:id',verifyToken,  listeController.show)

    router.post('/listes/assign',verifyToken,   listeController.assign)
    
    router.get('/listes/select',verifyToken, listeController.selectliste)

    router.get('/listes/valides',verifyToken, listeController.valides)

    router.get('/listes/valides/ByClient/:id',verifyToken, listeController.validesByClient)

    router.get('/listes/valides/ByPrestataire/:id',verifyToken, listeController.validesByPrestataire)

    router.get('/listes/publies',verifyToken, listeController.publies)

    router.get('/listes/enCours',verifyToken, listeController.enCours)

    router.get('/listes/enCours/ByPrestataire/:id',verifyToken, listeController.enCoursByPrestataire)

    router.get('/listes/publies/ByClient/:id',verifyToken, listeController.publiesByClient)

    router.post('/listes/prestataire/publish/:id',verifyToken,  listeController.publish)
 */

    app.use('/api', router);
  
}