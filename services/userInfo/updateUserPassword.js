import routes from "../../constants/routes.json"

export async function updateUserPassword(idToken, newPassword) {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.updateUserPassword}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken, newPassword }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update password: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("User password updated successfully:", result);
        return result;
    } catch (error) {
        console.error("Error updating user password:", error);
        throw error;
    }
}
