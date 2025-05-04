const { default: mongoose } = require("mongoose")

const conversation = new mongoose.Schema({
    name: {type: String, required: true},
    lastMessage: {type: String, required: false},
    time:{type: Date, default: Date.now},
    unread: {type: Number, default: 0},
    avatar: {type: String },
    online: {type: Boolean, default: true},
    status: {type: String, default: "online"},
    archived: {type: Boolean, default: false},
    chatParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
});

const Conversation = mongoose.model('Conversation', conversation)

module.exports={Conversation}
