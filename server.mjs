import express from 'express'
import cors from "cors"

app.use(express.json());
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})