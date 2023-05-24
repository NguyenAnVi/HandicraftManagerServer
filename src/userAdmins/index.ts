import {UserModel} from '../models/User'
import { Request, Response } from 'express'

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

const userAdmin = {
  home: (req: ModRequest, res : Response)=>{
    return res.status(200).send({message:`success admin home ${req.user.role}`})
  },
  addVillage : ( uid:string ) => {
    UserModel.findById(uid)
      .then((result)=>{
        console.log("findById:",result);
        console.log("role:",result.role);
      })
      .catch((error)=>{
        console.log("error findById",error);
      })
      console.log("endof findById")
  },
  deleteVillage : () => {
    console.log("deleteVillage")
  }

}
export {userAdmin};