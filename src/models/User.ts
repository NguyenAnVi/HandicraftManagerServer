import mongoose from 'mongoose'
import bcrypt from 'bcrypt-nodejs'

interface USchema{
  name: string,
  email: string,
  phone: string,
  password: string,
  role: string
}
type CallbackFunction = (param1: Error, param2?: boolean)=>{}

// Define the model
const Schema = new mongoose.Schema<USchema>({
    name: {
      type: String
    },
    email: {
      type: String,
      lowercase: true,
      unique: false,
      sparse: true,
      validate: {
        validator(v:string) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: `{VALUE} is not a valid email address!`
      }
    },
    phone: {
      type: String,
      unique: true,
      validate: {
        validator(v:string) {
          return /^[0-9]{10}$/.test(v);
        },
        message: `{VALUE} is not a valid phone number!`
      }
    },
    role: String,
    password: String

})

Schema.pre('save', (next) => {
    // get access to user model, then we can use user.email, user.password
    const user = this as USchema;

    bcrypt.genSalt(10, (err: Error, salt) => {
        if (err) { return next(err) }

        bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
            if (hashErr) { return next(hashErr); }

            user.password = hash;
            next()
        })
    })
})

// Make use of methods for comparedPassword
Schema.methods.comparedPassword = async function (candidatePassword:string ,expectedPassword:string, cb: Function) {
  bcrypt.compare(candidatePassword, expectedPassword, (err, good) => {
      if (err) { return cb(err)}
      cb(null, good);
  })
}

const UserModel = mongoose.model('User', Schema);
// Export the model
export { UserModel }