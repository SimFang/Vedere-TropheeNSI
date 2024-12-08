import routes from "../../constants/routes.json";

export default async function validateShooting(propositionId, userId) {
    const url = `${routes.serverUrl}${routes.validateShooting}`;
    try {
        // Validate the input
        if (!propositionId || typeof propositionId !== "string") {
            throw new Error("Invalid proposition ID provided.");
        }

        // Prepare the request payload
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ shooting_id: propositionId, user_id: userId }),
        });

        // Parse and handle the response
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Failed to toggle proposition validation."
            );
        }

        const data = await response.json();
        console.log("succesfully validated the answer")
        return data; // Return the response data to the caller
    } catch (error) {
        console.error("Error toggling proposition validation:", error.message);
        throw error; // Re-throw the error to handle it in the calling code
    }
}