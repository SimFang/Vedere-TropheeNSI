// services/user-service/controllers/userController.js
require('dotenv').config(); // Load environment variables
const Mailjet = require('node-mailjet');
const path = require('path'); // For file path resolution
const fs = require('fs'); // To read the HTML file


const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_APIKEY,
    process.env.MAILJET_SECRETKEY,
);

emailVerification = async () => {
    const email = "orecoreshimada@gmail.com"

    
        // Generate a random verification code (e.g., 6-digit code)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Read the HTML template from the file system
        const htmlTemplatePath = path.join(__dirname, '../../..', 'assets', 'emailVerification.html');
        let htmlContent = fs.readFileSync(htmlTemplatePath, 'utf-8'); // Read file content as string

        // Replace the placeholder in the HTML template with the actual verification code
        htmlContent = htmlContent.replace('${verificationCode}', verificationCode);

        // Email content
        const request = mailjet
            .post('send', { version: 'v3.1' })
            .request({
                Messages: [
                    {
                        From: {
                            Email: 'vedere.technology@gmail.com', // Your sender email
                            Name: 'Vedere', // Your sender name
                        },
                        To: [
                            {
                                Email: email, // Receiver's email
                            },
                        ],
                        Subject: 'Complete Your Registration with Vedere',
                        TextPart: `Your verification code is ${verificationCode}`,
                        HTMLPart: htmlContent, // Use the dynamic HTML content
                    },
                ],
            });

        // Send email
        await request;
};

emailVerification()