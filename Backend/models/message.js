const { default: mongoose } = require("mongoose")

const message = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    text: {type: String, required: false},
    time:{type: Date, default: Date.now},
    conversationId: {type: mongoose.Schema.Types.ObjectId, ref: 'conversation'}
});

const Message = mongoose.model('Message', message)

module.exports={Message}