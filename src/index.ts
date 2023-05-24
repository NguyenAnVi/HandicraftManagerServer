import mongoose from 'mongoose';
import express from "express";
import cors from 'cors'
import cookieParser  from 'cookie-parser'
import bodyParser  from 'body-parser'
import dotenv from 'dotenv'

import {config} from './config'

// import ApiError from './api/ApiError.js'
import {signin, signup} from './api/authentication'
import {loginRequired} from './api/middleware'
import {userAdmin} from './userAdmins'

dotenv.config()

if(!config.jwt_secret || config.jwt_secret==="unsafe_jwt_secret") {
  const err = new Error('No JWT_SECRET in env variable, check instructions: https://github.com/amazingandyyy/mern#prepare-your-secret');
}

mongoose.connect(config.db.uri, { useNewUrlParser: false } as mongoose.ConnectOptions)
  .then(() => console.log('MongoDB Connected \n'+config.db.uri))
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
app.post('/signup', signup)
app.post('/signin', signin)
app.post('/admin', loginRequired, userAdmin.home)

// handle 404 response
app.use((req, res, next) => {
  // Code ở đây sẽ chạy khi không có route được định nghĩa nào
  // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
  // return next(new ApiError(404, "Resource not found"));
  return res.status(404).send({message:"Resource Not Found"});
});


app.use((err: Error, req: express.Request, res: express.Response, next:express.NextFunction) => {
  // Middleware xử lý lỗi tập trung.
  // Trong các đoạn code xử lý ở các route, gọi next(error)
  // sẽ chuyển về middleware xử lý lỗi này
  return res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});

const port = config.server.port
// const host = config.server.host

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`Server running on port ${port}`)
  console.log(`http://127.0.0.1:${port}`)
})

