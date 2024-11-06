import routes from "../../constants/routes.json";
// Function to modify photographer's price
export const modifyPhotographerPrice = async (photographerId, newValue) => {
    try {
        const response = await fetch(`${serverUrl}${routes.modifyPhotographerPrice}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photographerId, newValue }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error modifying photographer price:', error);
    }
};

// Function to modify photographer's state
export const modifyPhotographerState = async (photographerId, newValue) => {
    try {
        console.log(photographerId, newValue)
        const response = await fetch(`${routes.serverUrl}${routes.modifyPhotographerState}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photographerId, newValue }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error modifying photographer state:', error);
    }
};

// Function to modify photographer's operation location
export const modifyPhotographerOperationLocation = async (photographerId, newValue) => {
    try {
        console.log("sending the request")
        const response = await fetch(`${routes.serverUrl}${routes.modifyPhotographerOperationLocation}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photographerId, newValue }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error modifying photographer operation location:', error);
    }
};

// Function to modify photographer's description
export const modifyPhotographerDescription = async (photographerId, newValue) => {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.modifyPhotographerDescription}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photographerId, newValue }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error modifying photographer description:', error);
    }
};
