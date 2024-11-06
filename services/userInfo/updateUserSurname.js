import routes from "../../constants/routes.json"
export async function updateUserSurname(userId, surname) {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.updateUserSurname}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, surname }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update surname: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("User surname updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error updating user surname:", error);
        throw error;
    }
}
