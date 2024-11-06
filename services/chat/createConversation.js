import routes from "../../constants/routes.json"

export const createConversation = async (p1_id, p2_id) => {
    try {
      const response = await fetch(routes.serverUrl + routes.createConversation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p1_id,
          p2_id,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error.message);
      return null;
    }
  };