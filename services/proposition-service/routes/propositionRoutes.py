from flask import Flask, request, jsonify
from controllers.proposition_controller import (
    get_proposition_by_id, add_work_to_proposition, download_picture_from_url,
    get_last_propositions_with_results, toggle_proposition_validation
)

app = Flask(__name__)

# Configuration for file uploads
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # Limit file size to 10MB

@app.route('/getpropositionbyid', methods=['POST'])
def handle_get_proposition_by_id():
    return get_proposition_by_id()

@app.route('/addworktoproposition', methods=['POST'])
def handle_add_work_to_proposition():
    return add_work_to_proposition()

@app.route('/getlastpropositionswithresults', methods=['GET'])
def handle_get_last_propositions_with_results():
    return get_last_propositions_with_results()

@app.route('/validateproposition', methods=['POST'])
def handle_toggle_proposition_validation():
    return toggle_proposition_validation()

@app.route('/downloadpicturefromurl', methods=['POST'])
def handle_download_picture_from_url():
    return download_picture_from_url()

if __name__ == '__main__':
    app.run(debug=True)
