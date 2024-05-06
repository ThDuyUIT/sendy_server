import express from 'express'
import user_router from './routers/user'
import { protect, protectSocket} from './modules/auth';
import { Server } from 'socket.io';
import { createConversation, fetchConversation } from './handlers/conversation';
import conversation_router from './routers/conversation';
import {createMessage2, fetchMessages, joinConversation } from './handlers/message';
import message_router from './routers/message';
import {updateActiveStatus, updateOnlineState } from './handlers/user';
//import message_router from './routers/message';
const http = require('http');


const app = express();
const server = http.createServer(app);
//const io = require('socket.io')(server);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', user_router);
app.use('/api', conversation_router);
app.use('/api', message_router);



io.use((socket, next) => {
    protectSocket(socket, next);
})


export const messageByRoom = []
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
    updateActiveStatus(socket, true);
    fetchConversation(io, socket);
    joinConversation(socket);
    createMessage2(io, socket, messageByRoom);
    fetchMessages(io, socket, messageByRoom);
    //getMessagesByIdConversation(socket, messageByRoom);
    socket.on('disconnect', () => {
        updateActiveStatus(socket, false);
        console.log('A user disconnected')});
})


export default server;