const UserModel = require('../models/User')
const token = require ('../util/token.js');
const loginRequired = (req, res, next) => {
  if (!req.header('Authorization')) return res.status(401).send({message: 'Please make sure your request has an Authorization header.'});
  // Validate jwt
  let try_token = req.header('Authorization').split(' ')[0];
  token.verifyToken(try_token, (err, payload) => {
    if (err) return res.status(401).send(err);
    UserModel.findById(payload.sub)
      .then((result) => {
        if (!result) {
          return res.status(404).send({
              error: 'Middleware error: User not found!!!'
          });
        }
        if (result.role != payload.role)
          return res.status(403).send({
            error: 'Middleware error: User\'s role not found!!!'
          });
        delete result.password;
        req.user = result;  
        next();
      })
  })
}

module.exports = {loginRequired}