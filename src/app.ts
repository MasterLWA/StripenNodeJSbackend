import express from 'express';
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();


const app = express(); // create express app
app.use(cors()); // enable CORS
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse URL-encoded body


// import routers 
const stripeRouter = require('./stripe-route');

app.use(stripeRouter);

const port = process.env.PORT || 3000; // define port

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});