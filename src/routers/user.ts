import {Router}  from 'express'
import { createUser, getUser, getUserById, searchUser, signoutUser, updateOnlineState, updateUser } from '../handlers/user';
import { protect } from '../modules/auth';

const user_router = Router();

user_router.post('/user/signup', createUser)
user_router.get('/user/signin', getUser);
user_router.get('/user/signout', signoutUser);
user_router.get('/user/:id', protect, getUserById);
user_router.put('/user/update', protect, updateUser);
user_router.patch('/user/online', protect, updateOnlineState);
user_router.get('/search/:key', protect, searchUser);


export default user_router;