import {Router}  from 'express'
import { protect } from '../modules/auth';
import { createConversation, getAllConversationById, getConversationByIdMembers } from '../handlers/conversation';

const conversation_router = Router();


conversation_router.post('/conversation/create', protect, createConversation);
conversation_router.get('/conversation/get', protect, getConversationByIdMembers);
conversation_router.get('/conversation/getallbyid', protect, getAllConversationById);

export default conversation_router