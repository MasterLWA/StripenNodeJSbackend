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




router.post('/checkout', async (req, res) => {
  console.log('Request:', req.body);

  try {
    const { product, token } = req.body;

    console.log('Product:', product);
    console.log('Price:', product.price);

    const idempotencyKey = uuidv4();

    // Create a customer and charge them
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });



    router.post('/checkout', async (req, res) => {
        console.log('Request:', req.body);
      
        try {
          const { product, token } = req.body;
      
          console.log('Product:', product);
          console.log('Price:', product.price);
      
          const idempotencyKey = uuidv4();
      
          // Create a customer and charge them
          const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
          });
      
          const charge = await stripe.charges.create({
            amount: product.price * 100, // convert to cents
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
      
          // Create an invoice
          const invoice = await stripe.invoices.create({
            customer: customer.id,
            description: `Invoice for ${product.name}`,
            collection_method: 'send_invoice',
          });
      
          // Send the invoice
          const invoiceSent = await stripe.invoices.sendInvoice(invoice.id);
      
          console.log('Charge:', charge);
          console.log('Invoice Sent:', invoiceSent);
      
          // Send a successful response
          res.status(200).json({ charge, invoiceSent });
        } catch (err) {
          console.error(err);
          // Send an error response
          res.status(500).send('Internal Server Error');
        }
      });


module.exports = router;
