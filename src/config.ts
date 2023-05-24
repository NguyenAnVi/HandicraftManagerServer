import dotenv from 'dotenv'
dotenv.config()
const config = {
  server : {
    host: process.env.SERVER_HOST || 'http://127.0.0.1',
    port : process.env.SERVER_PORT || '3001'
  },
  db: {
    uri: `${process.env.MONGODB_URI}/${process.env.MONGODB_TABLE}` || "mongodb://127.0.0.1:27017/myhandicraftwebsite"
  },
  jwt_secret: process.env.JWT_SECRET || 'unsafe_jwt_secret'
}
export {config}