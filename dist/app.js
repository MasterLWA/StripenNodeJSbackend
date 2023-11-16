"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = (0, express_1.default)(); // create express app
app.use(cors()); // enable CORS
app.use(express_1.default.json()); // parse JSON body
app.use(express_1.default.urlencoded({ extended: true })); // parse URL-encoded body
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
//# sourceMappingURL=app.js.map