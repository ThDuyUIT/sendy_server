//import { insert } from '../db';
import { isValidObjectId } from 'mongoose';
import { createJWT, hashUid, compareUid } from '../modules/auth';
import User, {UserDocument} from '../mongodb/models/user_model';

export const createUser = async (req, res) => {
    console.log(req.body);
    req.body.uid = await hashUid(req.body.uid);
    const newUser: UserDocument = await User.create(req.body)
    await newUser.save();
    const token = createJWT(newUser);
    res.send({ token });
}

export const getUser = async (req, res) => {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    const isValid = await compareUid(req.body.uid, user.uid);
    if (isValid) { 
        const token = createJWT(user);
         res.status(200);
         return res.json({user: user, token: token});
    }
    
    res.status(401);
    res.json({message: 'Invalid username or password'});
}

export const updateUser = async (req, res) => {
    let user = await User.findOne({ idUser: req.body.idUser });
    //const isValid = await compareUid(req.body.uid, user.uid);
    if (user) {
        user.name = req.body.name;
        user.gender = req.body.gender;
        user.urlAvatar = req.body.urlAvatar;
        await user.save();
        res.status(200);
        return res.json({user: user});
    }
}

export const black_list = []
export const signoutUser = async (req, res) => {
    try {
        const token = req.body.token;
        black_list.push(token);
        return res.status(200).json({'signout': true});
    } catch (error) {
        return res.status(200).json({'signout': false});
    }
    //return res.json({message: 'LogOutSuccessfully'});
}

export const getUserById = async (req, res) => {
    const user = await User.findOne({ idUser: req.params.id });
    res.status(200);
    return res.json({user: user});
}

export const searchUser = async (req, res) => {
    const key = req.params.key;
    let listUsers;

    if(/^\d+$/.test(key)){
        listUsers = await User.find({ idUser:  key });
    }else{
        listUsers = await User.find({
            
            name: { $regex: key, $options: 'i' } 
            
        }); 
    }
    
    res.status(200);
    return res.json({listUsers: listUsers});  
    
}

export const updateOnlineState = async (req, res) => {
    const user = await User.findOne({ idUser: req.body.idUser });
    //const isValid = await compareUid(req.body.uid, user.uid);
    if (user) {
        user.activeStatus = req.body.activeStatus;
        await user.save();
        res.status(200);
    }
}

export const updateActiveStatus = async (socket, active: boolean) => {
    const idUser = socket.handshake.headers.iduser;
    console.log(idUser);
    let user = await User.findOne({ idUser: idUser });
    user.activeStatus = active;
    await user.save();
}