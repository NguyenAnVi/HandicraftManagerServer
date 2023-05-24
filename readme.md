# HandicraftManagerServer
This project is a Web Server manage , with **Express**, **TypeScript**

# Installation
## Create file ```/.env``` with contents:
```
NODE_ENV=PRODUCTION
SERVER_HOST= <YOUR_SERVER_URI>
SERVER_PORT=3001
JWT_SECRET= <YOUR_SECRET_KEY>
MONGODB_URI= <YOUR_MONGODB_URI>
MONGODB_TABLE= <YOUR_MONGODB_COLLECTION_>
```

## Open terminal run this command:
```
yarn
```

or

```
npm install
```

## Run the server with command:
```
yarn start
```
or
```
npm start
```
****

# Usage
## Available routes
* **/signup**  with the body look like this:
  ```
  {
    name: < User's name >,
    email: < User's email, optional >,
    phone: <User's phone, required for signin >,
    password: <User's password, required >
  }
  ```
  <image src="./readme_asset/routes/signup-route.png" style="width:50%;border-radius:16px;margin-left:25%"></image>
* **/signin**  with the body look like this:
  ```
  {
    phone: < user's phone number >,
    password: < user's password >
  }
  ```
  <image src="./readme_asset/routes/signin-route.png" style="width:50%;border-radius:16px;margin-left:25%"></image>
