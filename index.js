'use strict'
const express = require('express')
const config = require('./config.js')
const ApiError = require('./api/ApiError.js')
const mongoose = require ('mongoose')
const cors = require ('cors')
// const session = require ('express-session')
// const MongoStore = require ('connect-mongo')
const cookieParser  = require ('cookie-parser')
const bodyParser  = require ('body-parser')
const logger = require ('./util/logger.js')
const Authentication = require ('./api/authentication.js')
const dotenv = require('dotenv')
dotenv.config()

if(!config.jwt_secret || config.jwt_secret==="unsafe_jwt_secret") {
  logger.log(process.env.JWT_SECRET)
  logger.log(config.jwt_secret)
  const err = new Error('No JWT_SECRET in env variable, check instructions: https://github.com/amazingandyyy/mern#prepare-your-secret');
  logger.warn(err.message);
}

mongoose.connect(config.db.uri, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))

dotenv.config()
//use sessions for tracking logins

const app = express()

// app.set('view engine', 'pug');
// app.set('views','./views');
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

// This project doesnt use session
// app.use(session({
//   secret: process.env.SESSION_SECRET_KEY,
//   resave: true,
//   saveUninitialized: false, // don't create session until something stored
//   store: new MongoStore({
//     mongoUrl: config.db.uri,
//     ttl: 2 * 24 * 60 * 60, // Session expiration = 2 days.
//     autoRemove: 'native', // Set MongoDB to clean expired sessions (default mode)
//     collectionName:"sessions",
//     touchAfter: 10 * 60 // time period in seconds = 10 minutes
//   })
// }));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}));

// import userRoutes from './routes/userRoutes.js'
// import adminRoutes from './routes/adminRoutes.js'

app.get('/', (req, res) => res.json({'source': 'https://github.com/NguyenAnVi/bubupharmacymern.git'}))
app.get('/ping', (req, res) => res.send('pong'))
app.post('/signup', Authentication.signup)
app.post('/signin', Authentication.signin)
// app.use('/', userRoutes)

// handle 404 response
app.use((req, res, next) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  return next(new ApiError(404, "Resource not found"));
});
  

app.use((err, req, res, next) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error)
  // sẽ chuyển về middleware xử lý lỗi này
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const port = config.server.port
// const host = config.server.host

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
  console.log(`http://127.0.0.1:${port}`)
})

