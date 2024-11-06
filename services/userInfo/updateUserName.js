import routes from "../../constants/routes.json"
export async function updateUserName(userId, name) {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.updateUserName}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, name }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update name: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("User name updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error updating user name:", error);
        throw error;
    }
}
