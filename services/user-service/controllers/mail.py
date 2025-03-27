import os
from flask import Flask
from dotenv import load_dotenv
from mailjet_rest import Client
import random

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)

# Initialize Mailjet client
mailjet = Client(auth=(os.getenv('MAILJET_APIKEY'), os.getenv('MAILJET_SECRETKEY')), version='v3.1')

def email_verification():
    email = "orecoreshimada@gmail.com"

    # Generate a random verification code (e.g., 6-digit code)
    verification_code = str(random.randint(100000, 999999))

    # Read the HTML template from the file system
    html_template_path = os.path.join(os.path.dirname(__file__), '../../../assets/emailVerification.html')
    with open(html_template_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Replace the placeholder in the HTML template with the actual verification code
    html_content = html_content.replace('${verificationCode}', verification_code)

    # Email content
    data = {
        'Messages': [
            {
                'From': {
                    'Email': 'vedere.technology@gmail.com',
                    'Name': 'Vedere',
                },
                'To': [
                    {
                        'Email': email,
                    },
                ],
                'Subject': 'Complete Your Registration with Vedere',
                'TextPart': f'Your verification code is {verification_code}',
                'HTMLPart': html_content,
            },
        ],
    }

    # Send email
    result = mailjet.send.create(data=data)
    print(result.status_code)
    print(result.json())

# Call the email verification function
email_verification()

if __name__ == '__main__':
    app.run(debug=True)
