const mongoose = require('mongoose')

const notification = new mongoose.Schema({
    recipientId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    senderId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    message:{type: String, required: true},
    relatedOfferId: {type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: false},
    },
    {
    timestamps: true, // ajoute automatiquement createdAt et updatedAt
    }
)

const Notification = mongoose.model('notification', notification)


module.exports = {Notification}


