import routes from "../../constants/routes.json"

export async function updateUserEmail(userId, idToken, newEmail) {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.updateUserEmail}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId ,idToken, newEmail }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update email: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("User email updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error updating user email:", error);
        throw error;
    }
}
