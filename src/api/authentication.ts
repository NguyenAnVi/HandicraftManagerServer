import {token} from '../util/token'
import {UserModel} from '../models/User'
import { Request, Response, NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';

type ComparedPasswordFunction = (param1: string, param2: CallBackFunction)=>{};
type CallBackFunction = (param1: Error, param2: boolean)=>{};

interface USchema{
  id?: string,
  name: string,
  email: string,
  phone: string,
  password: string,
  role: string,
  comparedPassword?: Function
}

const signup = (req: Request, res:Response, next:NextFunction) => {
  const { phone, password, name, email } = req.body;

  if (!phone || !password || !name) {
    return res
      .status(422)
      .send({ error: 'You must provide name, phone and password.' });
  }
  UserModel
    .findOne({
      $or : [
        { phone },
        { email }
      ]
    })
    .then(
      (result: USchema) => {
        if (result) {
          return res
            .status(422)
            .send({ error: 'Phone or email is in use' });
        } else {

          const user = new UserModel({
            name,
            phone,
            password,
            email: (email)?(email):(""),
            role: "TEMP_GUEST"
          });

          user
            .save()
            .then((savedResult:USchema) => {
              if (!savedResult) {
                return next(savedResult)
              }
              res.json({
                success: true,
                user: {
                  name: savedResult.name || "",
                  email: savedResult.email || "",
                  role: savedResult.role
                },
                token: token.generateToken(savedResult)
              })
            })
        } // if (result) else
      } // function (result)
    ) // then
}
const signin = (req: Request, res:Response) => {
  const phone = req.body.phone;
  const password = req.body.password;
  if (!phone || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide email and password.' });
  }
  UserModel
    .findOne({
      phone
    }).then(
      (result: USchema) => {
        if (result == null) {
          return res.status(401).send(result || { error: "Wrong phone number or password" })
        } else {
          result.comparedPassword(password, result.password, (err:Error, good: boolean) => {
            if (err || !good) {
              return res.status(401).send(err?.message || { error: "Wrong password or phone number" })
            }
            res.send({
              user: {
                name: result.name || "",
                email: result.email || ""
              },
              token: token.generateToken(result)
            })
          })
        }
      }
    )
}

export { signup, signin }



