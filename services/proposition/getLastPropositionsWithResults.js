import routes from "../../constants/routes.json";

export async function fetchLastPropositionsWithResults() {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.getLastPropositionsWithResults}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any required authentication headers if necessary
                // 'Authorization': `Bearer ${yourToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Retrieved propositions:", data);
        return data; // Return the retrieved propositions

    } catch (error) {
        console.error("Failed to fetch last propositions:", error);
        throw error; // Rethrow the error for further handling if needed
    }
}

// Example usage
fetchLastPropositionsWithResults()
    .then(propositions => {
        // Handle the retrieved propositions here
        console.log("Propositions:", propositions);
    })
    .catch(error => {
        // Handle the error here
        console.error("Error fetching propositions:", error);
    });
