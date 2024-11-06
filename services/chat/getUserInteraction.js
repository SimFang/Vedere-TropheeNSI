import routes from "../../constants/routes.json"

export const getUserInteractions = async (userId) => {
    if (!userId) {
        return;
    }
    try {
        const response = await fetch(routes.serverUrl+routes.getUserInteraction, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Something went wrong');
        }

        const data = await response.json();
        return data
        // Do something with the retrieved conversations
    } catch (error) {
        console.log(error)
    }
};

