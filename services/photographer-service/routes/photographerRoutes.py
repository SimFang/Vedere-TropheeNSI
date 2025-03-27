from flask import Flask, request, jsonify
from controllers.photographer_controller import (
    request_photographer, get_photographer_by_id, get_nearest_photographers,
    is_photographer, load_dashboard, update_operation_location, update_description,
    update_price, update_state, add_image_to_work, remove_image_from_work
)
from controllers.test_controller import test, test2

app = Flask(__name__)

# Configuration for file uploads
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Limit file size to 10MB

@app.route('/request', methods=['POST'])
def handle_request():
    return request_photographer()

@app.route('/getnearest', methods=['POST'])
def handle_get_nearest():
    return get_nearest_photographers()

@app.route('/isphotographer', methods=['POST'])
def handle_is_photographer():
    return is_photographer()

@app.route('/loaddashboard', methods=['POST'])
def handle_load_dashboard():
    return load_dashboard()

@app.route('/getphotographerbyid', methods=['POST'])
def handle_get_photographer_by_id():
    return get_photographer_by_id()

@app.route('/updateoperationlocation', methods=['POST'])
def handle_update_operation_location():
    return update_operation_location()

@app.route('/updatedescription', methods=['POST'])
def handle_update_description():
    return update_description()

@app.route('/updateprice', methods=['POST'])
def handle_update_price():
    return update_price()

@app.route('/updatestate', methods=['POST'])
def handle_update_state():
    return update_state()

@app.route('/addimagetowork', methods=['POST'])
def handle_add_image_to_work():
    return add_image_to_work()

@app.route('/removeimagefromwork', methods=['POST'])
def handle_remove_image_from_work():
    return remove_image_from_work()

@app.route('/test', methods=['POST'])
def handle_test():
    return test()

@app.route('/test2', methods=['POST'])
def handle_test2():
    return test2()

if __name__ == '__main__':
    app.run(debug=True)
