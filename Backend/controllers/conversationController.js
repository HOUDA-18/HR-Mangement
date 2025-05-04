const res = require('express/lib/response')
const {Conversation}=require('../models/conversation')
const {Message}=require('../models/message')
const { Departement } = require('../models/departement')


exports.getConversations = async (req, res)=>{
    const {userId}=req.params
    try {
        const conversations = await Conversation.find( {chatParticipants:{ $in: [userId]} } ).populate('chatParticipants', '_id firstname lastname image')
        res.status(200).json(conversations)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.createGroupChat = async (req, res)=>{
    try {
        const hrDepartement = await Departement.findOne({name: 'HR'})
        const hrEmployees = hrDepartement.employees
        const conversation = new Conversation({
            name: "HR Team",
            lastMessage: null,
            time:null,
            unread: 0,
            chatParticipants: hrEmployees
        })

        const newConversation = await Conversation.create(conversation)
        res.status(201).json(newConversation) 
    } catch (error) {
        res.status(400).json(error) 
    }
}

exports.getConversationById = async (req, res)=>{
    const {id}=req.params
    try {
        const conversation = await Conversation.findById(id).populate('chatParticipants', '_id firstname lastname image')
        res.status(200).json(conversation)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.getMessagesByConversation = async (req, res)=>{
    const {chatId}=req.params
    try {
        const messages = await Message.find({conversationId: chatId}).populate('sender', '_id firstname lastname image')
        res.status(200).json(messages)
    } catch (error) {
        res.status(400).json(error)
    }
}

exports.saveMessage = async (req, res)=>{
    const {chatId}=req.params
    const {sender, text, timestamp}=req.body
    try {
        const conversation = await Conversation.findById(chatId)
        if(!conversation){
            res.status(404).json({"message": "chat doesn't exist "})
        }else{
            const message = new Message({
                sender: sender,
                text: text,
                time: timestamp || new Date(),
                conversationId: chatId
            })
            const newMessage =await (await Message.create(message)).populate('sender', '_id firstname lastname image')

            req.io.to(chatId).emit('receive_message', newMessage);

            res.status(201).json(newMessage)

        }

    } catch (error) {
        res.status(400).json(error.message)
    }
}