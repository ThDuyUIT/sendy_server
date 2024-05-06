import {Router} from 'express'
import { protect } from '../modules/auth';
import { getMessageById, sysncQueueMessages } from '../handlers/message';

const message_router = Router();


message_router.get('/message/getLastMessage', protect, getMessageById);
message_router.post('/message/syncQueueMessages', protect, sysncQueueMessages);


export default message_router