from flask import Flask, request, jsonify
import os
import stripe
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

# Initialize Stripe with your secret key
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

app = Flask(__name__)

@app.route('/handlePayment', methods=['POST'])
async def handle_payment():
    print("Received payment request")
    data = request.json
    amount = data.get('amount')  # Amount in cents

    try:
        # Create a new customer
        customer = stripe.Customer.create()

        # Create an ephemeral key for the customer
        ephemeral_key = stripe.EphemeralKey.create(
            {"customer": customer.id},
            api_version='2024-11-20.acacia'
        )

        # Create a payment intent
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            customer=customer.id,
            automatic_payment_methods={
                'enabled': True,
            },
        )

        return jsonify({
            'paymentIntent': payment_intent.client_secret,
            'ephemeralKey': ephemeral_key.secret,
            'customer': customer.id,
            'publishableKey': os.getenv('STRIPE_PUBLISHABLE_KEY')
        })

    except Exception as error:
        print("Error creating payment intent:", error)
        return jsonify({'error': str(error)}), 500

if __name__ == '__main__':
    app.run(debug=True)
