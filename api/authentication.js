const token = require('../util/token.js')
const UserModel = require('../models/User.js');

module.exports = {
  signup: (req, res, next) => {
    const { phone, password, name, email } = req.body;

    if (!phone || !password || !name) {
      return res
        .status(422)
        .send({ error: 'You must provide name, phone and password.' });
    }
    
    UserModel
      .findOne({
        $or : [
          { phone: phone },
          { email : email }
        ]
      })
      .then(
        function (result) {
          if (result) {
            return res
              .status(422)
              .send({ error: 'Phone or email is in use' });
          } else {
              
            var user = new UserModel({
              name: name,
              phone: phone,
              password: password,
              email: (email)?(email):(""),
              role: "TEMP_GUEST"
            });

            user
              .save()
              .then(function (result) {
                if (!result) {
                  return next(result)
                }
                res.json({
                  success: true,
                  user: {
                    name: result.name || "",
                    email: result.email || "",
                    role: result.role
                  },
                  token: token.generateToken(result)
                })
              })
          } // if (result) else
        } // function (result)
      ) //then
  },

  signin: (req, res, next) => {
    const phone = req.body.phone;
    const password = req.body.password;
    console.log(`Request signin: ${phone}:${password}`)
    if (!phone || !password) {
      return res
        .status(422)
        .send({ error: 'You must provide email and password.' });
    }
    UserModel
      .findOne({
        phone: phone
      }).then(
        function (result) {
          if (result == null) {
            return res.status(401).send(result || { error: "Wrong email or password" })
          } else {
            result.comparedPassword(password, function (err, good) {
              if (err || !good) {
                return res.status(401).send(err || { error: "Wrong password or email" })
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
}
