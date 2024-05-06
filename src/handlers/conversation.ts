import { Socket } from "socket.io-client"
import Conversation, { ConversationDocument } from "../mongodb/models/conversation_model";
import { hashUid } from "../modules/auth";




export const createConversation = async (req, res)=>{
    console.log('create conversation');
    const newConversation: ConversationDocument = await Conversation.create(req.body);  
    
    await newConversation.save();
    res.status(200).json({success: true});
}

export const getConversationByIdMembers = async (req, res) => {
    const listId = req.body.listId;
    const listConversation = await Conversation.findOne({members: {$all: listId}});
    //const idConversations = listConversation.map((conversation: ConversationDocument) => conversation.idConversation);
    //console.log(listConversation.idConversation);
    if(!listConversation) {
        res.status(200);
        return res.json({idConversation: null});
    }
    res.status(200);
    return res.json({idConversation: listConversation.idConversation});
}

export const getAllConversationById = async (req, res) => {
    const id = req.body.id;
    const listConversation = await Conversation.find({members: {$all: [id]}});
    if(!listConversation) {
        res.status(200);
        return res.json({listConversation: null});
    }
    res.status(200);
    return res.json({listConversation: listConversation});
}

export const fetchConversation = (io, client) => {
    //console.log('fetch conversation');
    const idSocket = client.id;
    client.on('FetchConversations', async (data) => {
        const idUser = data.idUser;
        const listConversation = await Conversation.find({members: {$all: [idUser]}});
        if(listConversation) {
            io.to(idSocket).emit('FetchConversationsSuccessfully', listConversation);
            return;
        }
    })
}




