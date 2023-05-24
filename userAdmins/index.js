const UserModel = require('../models/User')

module.exports = {
  home: (req, res)=>{
    return res.status(200).send({message:"success admin home"})
  },
  addVillage : ( uid ) => {
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