from flask import Flask, jsonify, request
from controllers.location_controller import get_suggestion, check_location, give_coordinates

app = Flask(__name__)

# Define the route for checking location
@app.route('/check', methods=['GET'])
def check():
    return check_location()

# Define the route for giving coordinates
@app.route('/givecoordinates', methods=['POST'])
def give_coordinates_route():
    return give_coordinates()

if __name__ == '__main__':
    app.run(debug=True)
