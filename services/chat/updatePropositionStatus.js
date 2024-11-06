import routes from "../../constants/routes.json"

export const updatePropositionStatusInChat = async (conversationId, key, newStatus, timestamp) => {

    console.log("convID"+conversationId)
    console.log("key"+key)
    console.log(newStatus)
    console.log(timestamp)

    try {
        const response = await fetch(routes.serverUrl+routes.updatePropositionStatusInChat, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversationId, key, newStatus, timestamp }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update status');
        }

        const data = await response.json();
        console.log('Status updated successfully:', data);
        return data; // Optionally return the response data
    } catch (error) {
        console.error('Error updating status:', error.message);
        // Handle the error as needed (e.g., show a notification)
    }
};