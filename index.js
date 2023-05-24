'use strict'
const express = require('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const cookieParser  = require ('cookie-parser')
const bodyParser  = require ('body-parser')
const dotenv = require('dotenv')

const config = require('./config.js')
const logger = require ('./util/logger.js')

const ApiError = require('./api/ApiError.js')
const Authentication = require ('./api/authentication.js')
const userAdminRoutes = require ('./userAdmins')
const Middleware = require('./api/middleware.js')

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

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000']
}));

app.get('/', (req, res) => res.json({'source': 'https://github.com/NguyenAnVi/bubupharmacymern.git'}))
app.get('/ping', (req, res) => res.send('pong'))
app.post('/signup', Authentication.signup)
app.post('/signin', Authentication.signin)
app.post('/admin', Middleware.loginRequired,userAdminRoutes.home)

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

