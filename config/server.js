// config/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const connectDB = require('./firebase'); // No connection function needed for Firestore
const WebSocket = require('ws');
const admin = require('firebase-admin');


const app = express();

// Use CORS middleware
app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json()); // Parse JSON request bodies

// Add a simple endpoint
app.get('/hey', (req, res) => {
    res.send('Hello, World!'); // Respond with 'Hello, World!'
});

// Import and use service routes
const userRoutes = require('../services/user-service/routes/userRoutes');
app.use('/api/users', userRoutes);

const photographerRoutes = require('../services/photographer-service/routes/photographerRoutes');
app.use('/api/photographers', photographerRoutes);

const locationRoutes = require('../services/location-service/routes/locationRoutes');
app.use('/api/location', locationRoutes);

const chatRoutes = require('../services/chat-service/routes/chatRoutes');
app.use('/api/chat', chatRoutes);

const propositionRoute = require('../services/proposition-service/routes/propositionRoutes')
app.use('/api/propositions', propositionRoute);

const paymentRoute = require('../services/payment-service/routes/paymentRoutes')
app.use('/api/payment', paymentRoute)

// Error handling middleware
const errorHandler = require('../middlewares/errorHandler');
app.use(errorHandler);

// Set up WebSocket server
const server = app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${server.address().port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');
  
    // Listen for changes in the Firebase Realtime Database
    const dbRealtime = admin.database();
    const ref = dbRealtime.ref('conversations'); // Replace with your data path
  
    ref.on('value', () => {
        // Notify all connected clients that data has changed
        ws.send(JSON.stringify({ message: 'Data has changed' }));
      });
  
    ws.on('close', () => {
      console.log('Client disconnected');
      // Optionally, remove the listener when the client disconnects
      ref.off();
    });
  });
