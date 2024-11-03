const express = require('express');
const {createConversation, getUserInteraction, addMessageToConversation, addPropositionToConversation, createNewProposition, updatePropositionStatusInChat} = require("../controllers/chatController")
const router = express.Router();

// Use the upload.array middleware before calling the requestPhotographer controller
router.post('/createconversation', createConversation);
router.post('/getuserinteraction', getUserInteraction);
router.post('/addmessagetoconversation', addMessageToConversation)
router.post('/addpropositiontoconversation', addPropositionToConversation)
router.post('/createNewProposition', createNewProposition)
router.put('/updatepropositionstatusinchat', updatePropositionStatusInChat)


module.exports = router;
