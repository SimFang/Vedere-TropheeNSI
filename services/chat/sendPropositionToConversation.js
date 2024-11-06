import routes from "../../constants/routes.json"

export async function sendPropositionToConversation(sender, type, date, hour, location, timestamp, conversationId) {
    const endpointUrl = routes.serverUrl+routes.addPropositionToConversation; // Replace with your actual endpoint URL
  
    const messageData = {
      sender,
      type,
      date,
      hour,
      location,
      timestamp,
      conversation_id: conversationId,
    };
  
    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_ID_TOKEN_HERE`, // Add your authorization token if needed
        },
        body: JSON.stringify(messageData),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error: ${errorData}`);
      }
  
      const result = await response.text();
      console.log(result); // Success message
    } catch (error) {
      console.error('Failed to send message:', error.message);
    }
  }
  