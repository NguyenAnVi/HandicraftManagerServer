import jwt from 'jwt-simple'
import {config} from '../config'
import { Schema } from 'mongoose'

interface TokenPayload{
    sub: Schema.Types.ObjectId,
    role: string,
  }

type CallBackFunction = (param1: string, param2?: TokenPayload)=>{};

interface UserProfile{
    id?: string,
    role: string
}

const token = {
    generateToken (user: UserProfile) {
        const timeStamp = new Date().getTime();
        const payload = {
            sub: user.id,
            role: user.role        }
        return jwt.encode(payload, config.jwt_secret);
    },
    verifyToken (inputToken: string, cb:CallBackFunction) {
        const decode = jwt.decode(inputToken, config.jwt_secret)
        if (!decode) return cb('Token is not verified.');
        cb(null, decode);
    }
}

export {token}