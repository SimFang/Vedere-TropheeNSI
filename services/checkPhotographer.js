import routes from "../constants/routes.json"

export async function checkPhotographer(userId) {
    try {
        const response = await fetch(routes.serverUrl+routes.checkphotographer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Send userId in the request body
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to check photographer status');
        }

        const data = await response.json();
        return data.isPhotographer; // This will return true or false
    } catch (error) {
        console.error('Error checking if user is photographer:', error);
        return false; // Default to false in case of error
    }
}