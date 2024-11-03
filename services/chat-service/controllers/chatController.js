// services/user-service/controllers/userController.js
require('dotenv').config(); // Load environment variables
const admin = require('firebase-admin');
const { dbRealtime, db } = require('../../../config/firebase');

const conversationsRef = dbRealtime.ref('conversations');

const {filterConversations} = require("../helpers/filterConversations")
const {boostProposition} = require("../helpers/boostProposition")

// services/user-service/controllers/userController.js
// services/user-service/controllers/userController.js
exports.createConversation = async (req, res) => {
    const { p1_id, p2_id } = req.body;

    if (!p1_id || !p2_id) {
        return res.status(400).json({ error: 'p1_id and p2_id are required' });
    }

    try {
        // Check if a conversation already exists with the same p1_id and p2_id
        const conversationsRef = dbRealtime.ref('conversations');
        const snapshot = await conversationsRef.once('value');

        let existingConversationId = null;

        snapshot.forEach((childSnapshot) => {
            const conversation = childSnapshot.val();
            if ((conversation.p1_id === p1_id && conversation.p2_id === p2_id) ||
                (conversation.p1_id === p2_id && conversation.p2_id === p1_id)) {
                existingConversationId = childSnapshot.key; // Get the conversation ID
            }
        });

        // If a conversation exists, return the ID
        if (existingConversationId) {
            console.log("Conversation already exists")
            return res.status(200).json({ message: 'Conversation already exists', id: existingConversationId });
        }

        // Generate a new unique key for the conversation
        const newConversationRef = conversationsRef.push();

        // Set the data for the new conversation
        await newConversationRef.set({
            p1_id,
            p2_id,
            lastmessage: "",
            lastTimestamp: "",
            proposition_id: "",
            chat: [""],
        });

        console.log("Successfully added");
        // Respond with success
        res.status(201).json({ success: 'Conversation added successfully', id: newConversationRef.key });
    } catch (error) {
        console.error('Error adding conversation:', error);
        res.status(500).json({ error: 'Failed to add conversation', details: error.message });
    }
};


exports.getUserInteraction = async(req,res)=>{
    console.log("retrieving user's conversation")
    const userId = req.body.userId;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    let Conversations ;
    let Propositions ;
    // Get all the conversations
    try {
            const conversationsRef = dbRealtime.ref('conversations');
            const snapshot = await conversationsRef.once('value');

            const conversations = snapshot.val();
            const userConversations = [];

            // Filter conversations where either p1_id or p2_id matches userId
            for (const key in conversations) {
                const conversation = conversations[key];
                if (conversation.p1_id === userId || conversation.p2_id === userId) {
                    let userData;

                    // Determine if the user is p1 or p2
                    if (conversation.p1_id === userId) {
                        // p1 is the user, fetch the photographer's data
                        const photographerId = conversation.p2_id; // p2 is the photographer
                        userData = await db.collection('photographers').doc(photographerId).get();
                    } else {
                        // p2 is the user, fetch the user's data
                        const userIdToFetch = conversation.p1_id; // p1 is the user
                        userData = await db.collection('Users').doc(userIdToFetch).get();
                    }

                    // Merge user data into the conversation object
                    if (userData.exists) {
                        const userInfo = userData.data();
                        userConversations.push({ id: key, ...conversation, ...userInfo });
                    } else {
                        userConversations.push({ id: key, ...conversation }); // No user data found
                    }
                }
            }
            Conversations = userConversations;
        } catch (error) {
            console.error('Error retrieving conversations:', error);
            return res.status(500).json({ error: 'Failed to retrieve conversations' });
        }
        try {
            const userPropositions = [];
            const propositionsRef = db.collection('propositions');
        
            // Get propositions where p1_id matches userId
            const querySnapshot = await propositionsRef.where('p1_id', '==', userId).where('status', '==', 1).get();
            // Add propositions where p1_id matches userId and fetch photographer data
            for (const doc of querySnapshot.docs) {
                let proposition = { id: doc.id, ...doc.data() };
                
                // Fetch photographer's data (since p1 is the user)
                const photographerId = proposition.p2_id; // p2 is the photographer
                const photographerDoc = await db.collection('photographers').doc(photographerId).get();
                
                if (photographerDoc.exists) {
                    proposition = {...proposition, ...photographerDoc.data()} // Merge photographer data
                } else {
                    proposition.photographer = null; // No photographer data found
                }
                
                userPropositions.push(proposition);
            }
        
            // Now check for propositions where p2_id matches userId
            const querySnapshot2 = await propositionsRef.where('p2_id', '==', userId).where('status', '==', 1).get();
            // Add propositions where p2_id matches userId and fetch user data
            for (const doc of querySnapshot2.docs) {
                let proposition = { id: doc.id, ...doc.data() };
                // Fetch user's data (since p2 is the user)
                const userIdToFetch = proposition.p1_id; // p1 is the user
                const userDoc = await db.collection('Users').doc(userIdToFetch).get();
                
                if (userDoc.exists) {
                    proposition = {...proposition, ...userDoc.data()};
                } else {
                    proposition.user = null; // No user data found
                }
                userPropositions.push(proposition);
            }
        
            Propositions = userPropositions;
        
        } catch (error) {
            console.error('Error retrieving propositions:', error);
            return res.status(500).json({ error: 'Failed to retrieve propositions' });
        }
        console.log(Propositions)

        const boostedPropositions = boostProposition(Conversations, Propositions)
        const filteredConversations = filterConversations(Conversations, Propositions)
    return res.status(200).json({
        conversations : filteredConversations,
        propositions : boostedPropositions,
    });
}   

exports.addMessageToConversation = async (req, res) => {
    // Step 1: Get data from the request body
    const { sender, type, content, timestamp, conversation_id } = req.body;
  
    // Step 2: Validate input
    if (!sender || !type || !content || !timestamp || !conversation_id) {
      return res.status(400).send('Bad Request: All fields are required');
    }
  
    try {
      // Step 3: Reference to the conversation in Firebase Realtime Database
      const conversationRef = admin.database().ref(`conversations/${conversation_id}`);
  
      // Step 4: Retrieve the conversation
      const snapshot = await conversationRef.once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).send('Conversation not found');
      }
  
      // Step 5: Prepare the new message object
      const newMessage = {
        sender,
        type,
        content,
        timestamp,
      };
  
      // Step 6: Push the new message into the chat list
      await conversationRef.child('chat').push(newMessage);

      // Step 6.5 : add last message
    
        try {
            await conversationRef.update({
                lastMessage: content,
                lastTimestamp: timestamp,
            });
        } catch (error) {
            console.error('Error updating last message:', error);
            throw new Error('Could not update last message');
        }
  
      // Step 7: Respond with success
      return res.status(200).send('Message added to conversation');
    } catch (error) {
      console.error('Error adding message to conversation:', error);
      return res.status(500).send('Internal Server Error');
    }
  };

  exports.addPropositionToConversation = async (req, res) => {
    // Step 1: Get data from the request body
    const { sender, type, date, hour, location, timestamp, conversation_id } = req.body;
  
    // Step 2: Validate input
    if (!sender || !type || !date || !hour || !location || !timestamp || !conversation_id) {
      return res.status(400).send('Bad Request: All fields are required');
    }
  
    try {
      // Step 3: Reference to the conversation in Firebase Realtime Database
      const conversationRef = admin.database().ref(`conversations/${conversation_id}`);
  
      // Step 4: Retrieve the conversation
      const snapshot = await conversationRef.once('value');
  
      if (!snapshot.exists()) {
        return res.status(404).send('Conversation not found');
      }
  
      // Step 5: Prepare the new message object
      const newMessage = {
        sender,
        type,
        date,
        hour,
        location,
        timestamp,
        status : 0
      };
  
      // Step 6: Push the new message into the chat list
      await conversationRef.child('chat').push(newMessage);

      // Step 6.5 : add last message
    
      try {
        await conversationRef.update({
            lastMessage: "NEW PROPOSITION 🤝",
            lastTimestamp: timestamp,
        });
        } catch (error) {
            console.error('Error updating last message:', error);
            throw new Error('Could not update last message');
        }
  
      // Step 7: Respond with success
      return res.status(200).send('Proposition added to conversation');
    } catch (error) {
      console.error('Error adding proposition to conversation:', error);
      return res.status(500).send('Internal Server Error');
    }
  };

  exports.createNewProposition = async (req, res) => {
    const {
        conversation_id,
        date,
        hour,
        location,
        isActive,
        isPaid,
        p1_id,
        p2_id,
        price,
        status,
    } = req.body;

    // Validate required fields
    if (!conversation_id || !date || !hour || !location || typeof isActive !== 'boolean' ||
        typeof isPaid !== 'boolean' || !p1_id || !p2_id) {
        return res.status(400).json({ error: 'All fields are required and must be valid.' });
    }

    try {
        // Check for existing propositions
        const propositionsSnapshot = await db.collection('propositions')
            .where('p1_id', '==', p1_id)
            .where('p2_id', '==', p2_id)
            .where('isActive', '==', true)
            .get();

        if (!propositionsSnapshot.empty) {
            // If there are existing propositions, return an error
            return res.status(409).json({ error: 'A proposition already exists for the specified users.' });
        }

        // Create a new proposition if no existing ones are found
        const propositionRef = db.collection('propositions').doc(); // Create a new document
        await propositionRef.set({
            conversation_id,
            date,
            hour,
            location,
            isActive,
            isPaid,
            p1_id,
            p2_id,
            price,
            status,
        });

        return res.status(201).json({ message: 'Proposition created successfully!' });
    } catch (error) {
        console.error('Error creating proposition: ', error);
        return res.status(500).json({ error: 'Failed to create proposition.' });
    }
};

exports.updatePropositionStatusInChat = async (req, res) => {
    const { conversationId, key, newStatus, timestamp } = req.body;
    console.log(key)
    console.log("conv id")
    console.log(conversationId)
    // Validate required fields
    if (!conversationId || !key || typeof newStatus !== 'number') {
        return res.status(400).json({ error: 'conversationId, key, and newStatus are required.' });
    }

    try {
        const conversationRef = admin.database().ref(`conversations/${conversationId}/chat/${key}`);
        
        // Check if the message exists
        const snapshot = await conversationRef.once('value');
        if (snapshot.exists()) {
            // If the message is found, update its status
            await conversationRef.update({ status: newStatus });
            return res.status(200).json({ message: 'Status updated successfully!' });
        } else {
            // If not found, retrieve all messages in the conversation
            const conversationSnapshot = await admin.database().ref(`conversations/${conversationId}/chat`).once('value');
            const chatData = conversationSnapshot.val();
            console.log(chatData)

            // Check if chatData is null or undefined
            if (!chatData) {
                return res.status(401).json({ error: 'No messages found for the given conversation.' });
            }

            // Find the message with matching timestamp and type 'proposition'
            let messageKeyToUpdate = null;
            for (const [msgKey, msgValue] of Object.entries(chatData)) {
                if (msgValue.timestamp === timestamp && msgValue.type === 'proposition') {
                    messageKeyToUpdate = msgKey;
                    break;
                }
            }

            // If a matching message is found, update its status
            if (messageKeyToUpdate) {
                const messageRef = admin.database().ref(`conversations/${conversationId}/chat/${messageKeyToUpdate}`);
                await messageRef.update({ status: newStatus });
                return res.status(200).json({ message: 'Status updated successfully for found proposition!' });
            } else {
                return res.status(401).json({ error: 'Message not found, and no matching proposition found with the given timestamp.' });
            }
        }
    } catch (error) {
        console.error('Error updating status: ', error);
        return res.status(500).json({ error: 'Failed to update status.' });
    }
};
