import express from 'express'
import cors from "cors"
import { nanoid } from 'nanoid'


app.use(express.json());
const app = express();
app.use(cors());

let userBase = [];

app.post('/signup', (req, res) => {

  let body = req.body;

  if(!body.firstName 
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

let isFound = false;

for(let i = 0; i < userBase.length; i++){
  if(userBase[i].email === body.email.toLowerCase()){
    isFound = true;
    break;
  }
}
if (isFound){
  res.status(400).send({
    message: `email ${email.body} already exist.`
  });
  return;
}

let newUser = {
  userId: nanoid(),
  firstName: body.firstName,
  lastName: body.lastName,
  email: body.email.toLowerCase(),
  password: body.password
}
 userBase.push(newUser);

 res.status(201).send({ message: `user is created` });
});

app.post(`/login`,(req, res) => {

  let body = req.body;

  if(!body.email2 || !body.password2){
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

for(let i = 0; i < userBase.length; i++){
  if(userBase[i].email2 === body.email2){

    isFound = true;
    if(userBase[i].password === body.password2) {

      res.status(200).send({
        firstName: userBase[i].firstName,
        lastName: userBase[i].lastName,
        email: userBase[i].email,
        message: "login successful",
        token: "some unique token"
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

if(!isFound){
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