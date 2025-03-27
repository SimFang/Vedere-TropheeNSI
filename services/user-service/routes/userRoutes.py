# routes/user_routes.py
from flask import Blueprint
from controllers.user_controller import (
    signup,
    login,
    get_user_profile,
    email_verification,
    update_profile_picture,
    update_password,
    update_email
)
from flask_uploads import UploadSet, IMAGES, configure_uploads

user_routes = Blueprint('user_routes', __name__)

# Configure file uploads
photos = UploadSet('photos', IMAGES)


# Routes
user_routes.route('/signup', methods=['POST'])(signup)
user_routes.route('/login', methods=['POST'])(login)
user_routes.route('/getinfo', methods=['GET'])(get_user_profile)
user_routes.route('/emailverification', methods=['POST'])(email_verification)


user_routes.route('/update-profile-picture', methods=['POST'])(update_profile_picture)

user_routes.route('/update-password', methods=['PATCH'])(update_password)
user_routes.route('/update-email', methods=['PATCH'])(update_email)
