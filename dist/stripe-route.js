var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
router.use(cors());
router.use(express.json()); // Add this line to parse JSON in the request body
router.get('/', (req, res) => {
    res.send('Hello World!');
});
router.post('/checkout', (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log('Request:', req.body);
    try {
        const { product, token } = req.body;
        console.log('Product:', product);
        console.log('Price:', product.price);
        const idempotencyKey = uuidv4();
        // Create a customer and charge them
        const customer = yield stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const charge = yield stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        }, { idempotencyKey });
        console.log('Charge:', charge);
        // Send a successful response
        res.status(200).json(charge);
    }
    catch (err) {
        console.error(err);
        // Send an error response
        res.status(500).send('Internal Server Error');
    }
}));
module.exports = router;
//# sourceMappingURL=stripe-route.js.map