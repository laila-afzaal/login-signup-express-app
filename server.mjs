import express from 'express'
import cors from "cors"
import { nanoid } from 'nanoid'
import mongoose from 'mongoose';
import {
  stringToHash,
  varifyHash,
} from "bcrypt-inzi"

const app = express();
app.use(express.json());
app.use(cors());

// let userBase = [];
const userSchema = new mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },

  age: { type: Number, min: 17, max: 65, default: 18 },
  subjects: Array,
  isMarried: { type: Boolean, dafault: false },

  createdOn: { type: Date, default: Date.now },

});
const userModel = mongoose.model('User', userSchema);

app.post('/signup', (req, res) => {

  let body = req.body;

  if (!body.firstName
    || !body.lastName
    || !body.email
    || !body.password
  ) {
    res.status(400).send(
      `required field missing, request example:
    {
      "firstName": "abc",
      "lastName": "xyz",
      "email": "abc@xyz.com",
      "password": "1234"
    }`
    );
    return;
  }

  //check if user already exist
  userModel.findOne({ email: body.email }, (err, data) => {
    if (!err) {
      console.log('data:', data);

      if (data) { //user already exist
        console.log('user already exist:', data);
        res.status(400).send({ message: 'user already exist, please try a different email' });
        return;

      } else { // user doesn't exist already

        stringToHash(body.password).then(hashString => {
          let newUser = new userModel({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email.toLowerCase(),
            password: hashString
          });

          newUser.save((err, result) => {
            if (!err) {
              //data saved
              console.log('data saved:', result);
              res.status(201).send({ message: `user is created` });
            } else {
              console.log('db error:', err)
              res.status(500).send('internal server error');
            }
          });
        })
      }
    } else {
      console.log('db error: ', err);
      res.status(500).send({ message: 'db error in query' });
    }
  })
});

app.get('/users', async (req, res) => {

  try {
    let allUser = await userModel.find({}).exec();
    res.send(allUser);
  } catch (error) {
    res.status(500).send({ message: 'error getting users' });
  }
})


app.post(`/login`, (req, res) => {

  let body = req.body;

  if (!body.email || !body.password) {
    res.status(400).send(
      `required fields missing, request example:
     {
      "email": "abc@xyz.com",
      "password": "1234"
     }`
    );
    return;
  }

  let isFound = false;

  for (let i = 0; i < userBase.length; i++) {
    if (userBase[i].email === body.email) {

      isFound = true;
      if (userBase[i].password === body.password) {

        res.status(200).send({
          firstName: userBase[i].firstName,
          lastName: userBase[i].lastName,
          email: userBase[i].email,
          message: "login successful",
          // token: "some unique token"
        })
        return;

      } else {
        res.status(401).send({
          message: "Incorrect password"
        })
        return;
      }
    }
  }

  if (!isFound) {
    res.status(404).send({
      message: "user not found"
    })
    return;
  }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

/////////////////////-MongoDB Connecting Code-////////////////////////////////
//boiler plate from : https://github.com/mInzamamMalik/MERN-Stack-Web-Development-Class/blob/main/03.%20nodejs/7.%20express%20login%20signup%20with%20database/server.mjs

let dbURI = 'mongodb+srv://abc:123@cluster0.zwm89fi.mongodb.net/socialMediaBase?retryWrites=true&w=majority';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
  console.log("Mongoose is connected");
  // process.exit(1);
});

mongoose.connection.on('disconnected', function () {//disconnected
  console.log("Mongoose is disconnected");
  process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
  console.log('Mongoose connection error: ', err);
  process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
  console.log("app is terminating");
  mongoose.connection.close(function () {
    console.log('Mongoose default connection closed');
    process.exit(0);
  });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////