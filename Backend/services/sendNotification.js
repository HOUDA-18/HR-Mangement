const { Notification } = require("../models/notification")


exports.sendNotification = async (recepientId, message, offreId, senderId)=>{
    const notification = new  Notification({
        recipientId: recepientId,
        senderId: senderId,
        message: message,
        relatedOfferId: offreId
    })

    const createdNotif = await Notification.create(notification);

    const populatedNotif = await Notification.findById(createdNotif._id)
      .populate('relatedOfferId')
      .populate('senderId', 'image');
    
    return populatedNotif;

}
