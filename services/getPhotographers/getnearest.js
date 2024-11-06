import routes from "../../constants/routes.json"
export async function getNearestPhotographers(userPosition, type, expertise) {
    const url = routes.serverUrl+routes.getPhotographersWithFilters;


    const requestBody = {
        userPosition: {
            latitude: userPosition.latitude,
            longitude: userPosition.longitude,
        },
        type,
        expertise,
    };
    

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const photographers = await response.json();
        return photographers;
    } catch (error) {
        console.error('Error fetching nearest photographers:', error);
        throw error; // Rethrow error to handle it where the function is called
    }
}
