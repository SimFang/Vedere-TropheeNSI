from flask import Flask, jsonify, request
from controllers.payment_controller import handle_payment

app = Flask(__name__)

# Define the route for handling payment
@app.route('/handlepayment', methods=['POST'])
def handle_payment_route():
    return handle_payment()

if __name__ == '__main__':
    app.run(debug=True)
