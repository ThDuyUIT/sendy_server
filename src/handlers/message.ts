import { Client } from "socket.io/dist/client";
import { hashUid } from "../modules/auth";
import Message, { MessageDocument } from "../mongodb/models/message_model";
import { io } from "socket.io-client";
import Conversation, { ConversationSchema } from "../mongodb/models/conversation_model";
import { messageByRoom } from "../server";

// export const createMessage = (client) => {
//     client.on('SendMessage', async (data) => {
//         //console.log(data);
//         try {
//             const newMessage: MessageDocument = await Message.create(data);
//             newMessage.status = 1;
//             await newMessage.save();
            
//             client.emit('SendSuccessfuly', data.idMessage);
            
//         } catch (error) {
//             console.log(error);
//             client.emit('SendSuccessfuly', null);
//         }
//         //return;
//     });
// }

export const createMessage2 = (io, client, messagesByRoom) => {
    client.on('SendMessage', async (data) => {

        console.log('New message: ' + data);
        const roomId = data.idConversation
        const newMessage: MessageDocument = await Message.create(data);
        newMessage.status = 1;
        await newMessage.save();
        let conversation = await Conversation.findOne({idConversation: roomId}) ;
        conversation.lastMessage = newMessage;
        await conversation.save();
        if (!messagesByRoom[roomId]) {
            messagesByRoom[roomId] = [];
        }
        messagesByRoom[roomId].push(newMessage);
        
    });
}


// export const getMessages = async (req, res) => {
//     console.log(req.body);
//     const idConversation = req.body.idConversation;
//     const listMessages = await Message.find({idConversation: idConversation});
//     if(listMessages){
//         res.status(200);
//         return res.json({listMessages: listMessages});
//     }
    
// }

// export const getMessagesByIdConversation = (client, messagesByRoom) => {

//     client.on('LoadMessage', async (data) => {
//         const roomId = data.idConversation
//         client.join(roomId);
//         const numConnections = Object.keys(client.adapter.rooms[roomId]).length;
//         if(!messagesByRoom[roomId]) {
//             messagesByRoom[roomId] = [];
//         }

//         try {
//             let listMessages = await Message.find({idConversation: data.idConversation});
//             if(numConnections == 2) {
//                 listMessages.forEach(message => {
//                     message.status = 2;
//                     message.save();
//                 })
//             }
//             messagesByRoom[roomId] = listMessages;
//             client.emit('GetMessagesSuccessfuly', messagesByRoom[roomId]);
//         } catch (error) {
//             console.log(error);
//             client.emit('GetMessagesSuccessfuly', null);
//         }
//         //return;
//     });
// }

export const joinConversation = (client) => {
    client.on('JoinConversation', async (data) => {
        if(!data.idConversation) return
        console.log(data.idConversation);
        const roomId = data.idConversation
        client.join(roomId)
    })
}

export const fetchMessages = (io, client, messagesByRoom) => {
    client.on('FetchMessages', async (data) => {
        const roomId = data.idConversation
        if(!messagesByRoom[roomId]) {
            messagesByRoom[roomId] = [];
        }

        try {
            let listMessages = await Message.find({idConversation: data.idConversation});
            listMessages.forEach(message => {
                if(message.idSender != data.idUser && message.status == 1) {
                    message.status = 2;
                    message.save();
                }
            })

            let conversation = await Conversation.findOne({idConversation: roomId});
            if (conversation.lastMessage.status == 1 && data.idUser != conversation.lastMessage.idSender) {
                conversation.lastMessage.status = 2;
                await conversation.save();
                console.log(conversation.lastMessage);
            }

            messagesByRoom[roomId] = listMessages;
            io.to(roomId).emit('FetchMessagesSuccessfully', messagesByRoom[roomId]);
        } catch (error) {
            console.log(error);
            client.emit('FetchMessagesSuccessfully', null);
        }
    })
}

export const getMessageById = async (req, res) => {
    const id = req.body.idMessage;
    const message = await Message.findOne({idMessage: id});
    if(message) {
        res.status(200);
        return res.json({message: message});
    }
    // res.status(200);
    // return res.json({message: null});
}

export const sysncQueueMessages = async (req, res) => {
   
    try {
        const queueMessages = req.body.queueMessages;
        console.log('sync queue messages');
        queueMessages.forEach(async (message) => {
            console.log(message);
            const newMessage: MessageDocument = await Message.create(message);
            newMessage.status = 1;
            await newMessage.save();
            let conversation = await Conversation.findOne({ idConversation: message.idConversation });;
            conversation.lastMessage = newMessage;
            await conversation.save();
            messageByRoom[message.idConversation].push(newMessage);
        });

        return res.status(200).json({message: true});
    } catch (error) {
        return res.status(200).json({message: false});
    }
    
}