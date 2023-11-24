const {setCommonError} = require("../utilities/commonErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const doStripePayment = async (req, res, next) => {
    try {
        const {body} = req;
        const customer = await stripe.customers.create();
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2023-10-16'}
        );
        const amountInCents = Math.round(body.amount * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: body.currency,
            customer: customer.id,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.status(200).json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
}

module.exports = {
    doStripePayment
}