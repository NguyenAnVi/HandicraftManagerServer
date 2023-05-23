const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

// Define the model
const Schema = new mongoose.Schema({
    name: String,
    email: {
      type: String,
      lowercase: true,
      unique: false,
      sparse: true,
      validate: {
        validator: function(v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function(v) {
          return /^[0-9]{10}$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    role: mongoose.Schema.Types.ObjectId,
    password: String
    
})

Schema.pre('save', function(next){
    // get access to user model, then we can use user.email, user.password
    const user = this;

    bcrypt.genSalt(10, function(err, salt){
        if (err) { return next(err) }

        bcrypt.hash(user.password, salt, null, function(err, hash){
            if (err) { return next(err); }

            user.password = hash;
            next()
        })
    })
})

// Make use of methods for comparedPassword
Schema.methods.comparedPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, good){
        if (err ) { return cb(err)}
        cb(null, good);
    })
}

// Export the model
module.exports = mongoose.model('User', Schema);