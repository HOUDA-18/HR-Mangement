const { Notification } = require("../models/notification")





exports.getNotifications = async (req, res)=>{
    const {userId}=req.params
    try {
        const notifications = await Notification.find( {recipientId:userId } ).populate('relatedOfferId').populate('senderId');
        res.status(200).json(notifications)
    } catch (error) {
        res.status(400).json(error.message)
    }
}


/* exports.createNotification = async (req, res)=>{
    try {
        const hrDepartement = await Departement.findOne({name: 'HR'})
        const hrEmployees = hrDepartement.employees
        const notification = new Notification({
            recipientId: "HR Team",
            
        })

        const newConversation = await Conversation.create(conversation)
        res.status(201).json(newConversation) 
    } catch (error) {
        res.status(400).json(error) 
    }
} */