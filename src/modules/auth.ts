import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { black_list } from '../handlers/user';
import User,{ UserSchema } from '../mongodb/models/user_model';
import { Socket } from 'socket.io';

export const compareUid = (uid: string, hash: string) => {
    return bcrypt.compare(uid, hash);
};

export const hashUid = (uid: string) => {
    return bcrypt.hash(uid, 5);
};

export const createJWT = (user) => {
    //console.log(process.env.JWT_SECRET)
    const token = jwt.sign(
        {
         uid: user.uid, 
         email: user.email
        }, 
        process.env.JWT_SECRET,
    );
    return token;
};

export const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if(!bearer) {
        res.status(401);
        res.json({message: 'Not authorized'});
        return;
    }
    const [, token] = bearer.split(' ');
    if(!token) {
        res.status(401);
        res.json({message: 'Not valid token'});
        return;
    }

    try {
        if(black_list.find(t => t === token)) {
            res.status(401);
            res.json({message: 'Not valid token'});
            return;
        }
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401);
        res.json({message: 'Not valid token'});
        return;
    }

}

export const protectSocket = (socket, next) => {
    console.log('protect socket');
    const token = socket.handshake.headers.bearer;
    //console.log(token);
    if(!token) {
        next(new Error('Not authenticated'));
        return;
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        next(new Error('Not valid token'));
    }
}

// export const updateActiveStatus = async (socket, next) =>{
//     console.log('update active status');
//     const idUser = socket.handshake.headers.iduser;
//     let user = await User.findOne({ idUser: idUser });
//     socket.on('connection', () => {
//         console.log('online')
//         user.activeStatus = true;
//     })
//     socket.on('disconnect', () => {
//         console.log('offline')
//         user.activeStatus = false;
        
//     });
//     await user.save;
    
//     // user.activeStatus = true;
//     // await user.save();
//     next();
// }

