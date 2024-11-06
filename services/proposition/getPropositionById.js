import routes from "../../constants/routes.json"

export const getPropositionById = async (propositionId) => {
    try {
        const response = await fetch(`${routes.serverUrl}${routes.getPropositionById}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ propositionId }),
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve proposition');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error retrieving proposition:', error);
        return null;
    }
};
