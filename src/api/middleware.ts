import {UserModel} from '../models/User'
import {token} from '../util/token'
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';

interface TokenPayload{
  sub: Schema.Types.ObjectId,
  role: string,
}

interface USchema{
  name: string,
  email: string,
  phone: string,
  password: string,
  role: string
}

interface ModRequest extends Request{
  user: USchema
}

const loginRequired = (req:ModRequest, res:Response, next:NextFunction) => {
  if (!req.header('Authorization')) return res.status(401).send({message: 'Please make sure your request has an Authorization header.'});
  // Validate jwt
  const tryToken = req.header('Authorization').split(' ')[0];
  token.verifyToken(tryToken, (err:string, payload:TokenPayload) => {
    if (err) return res.status(401).send(err);
    UserModel.findById(payload.sub)
      .then((result) => {
        if (!result) {
          return res.status(404).send({
              error: 'Middleware error: User not found!!!'
          });
        }
        if (result.role !== payload.role)
          return res.status(403).send({
            error: 'Middleware error: User\'s role not found!!!'
          });
        // delete result.password;
        req.user = result;
        next();
      })
  })
}

export {loginRequired}